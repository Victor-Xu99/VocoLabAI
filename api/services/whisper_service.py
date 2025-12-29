import os
from openai import OpenAI
from config import settings


class WhisperService:
    """Service for transcribing audio using OpenAI Whisper"""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
    
    async def transcribe(self, audio_file_path: str) -> dict:
        """
        Transcribe audio file using Whisper
        
        Args:
            audio_file_path: Path to the audio file
            
        Returns:
            dict with 'text' and 'words' (with timestamps)
        """
        with open(audio_file_path, "rb") as audio_file:
            transcript = self.client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="verbose_json",
                timestamp_granularities=["word"]
            )
        
        return {
            "text": transcript.text,
            "words": transcript.words if hasattr(transcript, 'words') else []
        }
