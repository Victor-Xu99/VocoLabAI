from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import asyncio
from pathlib import Path
import shutil

from config import settings
from models import AssessmentResponse, PracticeSentence
from services.whisper_service import WhisperService
from services.azure_service import AzureSpeechService
from services.claude_service import FeedbackService
from analyzer import ErrorAnalyzer

# Initialize FastAPI app
app = FastAPI(
    title="VocoLabAI API",
    description="AI-powered speech training and pronunciation assessment",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Initialize services
whisper_service = WhisperService()
azure_service = AzureSpeechService()
feedback_service = FeedbackService()
error_analyzer = ErrorAnalyzer()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "VocoLabAI API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "whisper": "configured",
            "azure": "configured",
            "feedback": "rule-based"
        }
    }


@app.post("/api/assess", response_model=AssessmentResponse)
async def assess_pronunciation(
    audio: UploadFile = File(..., description="Audio file (WAV, MP3)"),
    reference_text: str = Form(..., description="The expected text to pronounce")
):
    """
    Main endpoint for pronunciation assessment
    
    Process:
    1. Save uploaded audio file
    2. Parallel API calls to Whisper (transcription) and Azure (pronunciation)
    3. Analyze errors
    4. Generate rule-based feedback with practice sentences
    5. Return comprehensive assessment
    """
    audio_path = None
    
    try:
        # Validate file type
        if not audio.content_type or not audio.content_type.startswith("audio/"):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Save uploaded file
        file_extension = Path(audio.filename).suffix or ".wav"
        audio_path = UPLOAD_DIR / f"temp_{audio.filename}"
        
        with open(audio_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
        
        # Run Whisper and Azure in parallel for faster processing
        whisper_task = whisper_service.transcribe(str(audio_path))
        azure_task = azure_service.assess_pronunciation(str(audio_path), reference_text)
        
        whisper_result, azure_result = await asyncio.gather(whisper_task, azure_task)
        
        # Check for Azure errors
        if "error" in azure_result:
            raise HTTPException(status_code=500, detail=f"Azure assessment failed: {azure_result['error']}")
        
        # Extract results
        transcription = whisper_result["text"]
        pronunciation_score = azure_result["pronunciation_score"]
        accuracy_score = azure_result["accuracy_score"]
        fluency_score = azure_result["fluency_score"]
        completeness_score = azure_result["completeness_score"]
        azure_words = azure_result["words"]
        
        # Analyze errors
        word_errors = error_analyzer.analyze_errors(
            reference_text=reference_text,
            transcription=transcription,
            azure_words=azure_words
        )
        
        # Calculate overall score
        overall_score = error_analyzer.calculate_overall_score(
            pronunciation_score=pronunciation_score,
            accuracy_score=accuracy_score,
            fluency_score=fluency_score,
            completeness_score=completeness_score
        )
        
        # Generate personalized feedback (rule-based)
        word_errors_dict = [error.dict() for error in word_errors]
        feedback_result = await feedback_service.generate_feedback(
            reference_text=reference_text,
            transcription=transcription,
            pronunciation_score=pronunciation_score,
            word_errors=word_errors_dict
        )
        
        # Prepare practice sentences
        practice_sentences = [
            PracticeSentence(**sentence)
            for sentence in feedback_result["practice_sentences"]
        ]
        
        # Build response
        response = AssessmentResponse(
            transcription=transcription,
            reference_text=reference_text,
            overall_score=overall_score,
            pronunciation_score=pronunciation_score,
            accuracy_score=accuracy_score,
            fluency_score=fluency_score,
            completeness_score=completeness_score,
            word_errors=word_errors,
            feedback=feedback_result["feedback"],
            tips=feedback_result["tips"],
            practice_sentences=practice_sentences
        )
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assessment failed: {str(e)}")
    
    finally:
        # Cleanup: delete temporary audio file
        if audio_path and audio_path.exists():
            try:
                os.remove(audio_path)
            except Exception:
                pass  # Ignore cleanup errors


@app.post("/api/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(..., description="Audio file to transcribe")
):
    """
    Simple transcription endpoint (Whisper only)
    """
    audio_path = None
    
    try:
        # Save file
        audio_path = UPLOAD_DIR / f"temp_{audio.filename}"
        with open(audio_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
        
        # Transcribe
        result = await whisper_service.transcribe(str(audio_path))
        
        return {
            "transcription": result["text"],
            "words": result["words"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    
    finally:
        if audio_path and audio_path.exists():
            try:
                os.remove(audio_path)
            except Exception:
                pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
