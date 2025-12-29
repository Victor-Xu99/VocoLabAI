# VocoLabAI Backend API

Simple MVP backend for AI-powered speech training and pronunciation assessment.

## Features

- 🎤 Audio file upload and processing
- 📝 Speech-to-text transcription (Whisper API)
- 🎯 Pronunciation assessment (Azure Speech Services)
- 💡 Rule-based feedback generation
- 📊 Phoneme-level error analysis
- 🎓 Adaptive practice sentence generation

## Tech Stack

- **FastAPI** - Modern Python web framework
- **OpenAI Whisper** - Speech transcription
- **Azure Speech Services** - Pronunciation assessment

## Quick Start

### 1. Install Dependencies

```bash
cd api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `OPENAI_API_KEY` - Get from https://platform.openai.com/
- `AZURE_SPEECH_KEY` & `AZURE_SPEECH_REGION` - Get from https://azure.microsoft.com/

### 3. Run the Server

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at http://localhost:8000

## API Endpoints

### `POST /api/assess`

Main pronunciation assessment endpoint.

**Request:**
- `audio` (file): Audio file (WAV, MP3)
- `reference_text` (form): Expected text to pronounce

**Response:**
```json
{
  "transcription": "...",
  "reference_text": "...",
  "overall_score": 85.5,
  "pronunciation_score": 88.0,
  "accuracy_score": 90.0,
  "fluency_score": 82.0,
  "completeness_score": 95.0,
  "word_errors": [...],
  "feedback": "Great job! Your pronunciation is...",
  "tips": ["Focus on...", "Practice...", "Try..."],
  "practice_sentences": [...]
}
```

### `POST /api/transcribe`

Simple transcription endpoint (Whisper only).

**Request:**
- `audio` (file): Audio file

**Response:**
```json
{
  "transcription": "...",
  "words": [...]
}
```

### `GET /health`

Health check endpoint.

## Architecture

```
User Audio Upload → FastAPI
                    ↓
            ┌───────┴────────┐
            ↓                ↓
        Whisper API     Azure Speech API
            ↓                ↓
        Transcription    Pronunciation Scores
            ↓                ↓
            └───────┬────────┘
                    ↓
            Error Analysis
                    ↓
        Rule-Based Feedback
                    ↓
        JSON Response
```

## Project Structure

```
api/
├── main.py                 # FastAPI application
├── config.py              # Configuration & settings
├── models.py              # Pydantic models
├── analyzer.py            # Error analysis logic
├── services/
│   ├── whisper_service.py # Whisper integration
│   ├── azure_service.py   # Azure Speech integration
│   └── claude_service.py  # Feedback generation (rule-based)
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables (create from .env.example)
```

## Development

**Install in development mode:**
```bash
pip install -r requirements.txt
```

**Run with auto-reload:**
```bash
uvicorn main:app --reload
```

**API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

### Railway/Render

1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Use Python buildpack
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Docker (optional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Testing

```bash
# Test with curl
curl -X POST http://localhost:8000/api/assess \
  -F "audio=@test.wav" \
  -F "reference_text=Hello world"
```

## Notes

- This is a **proof-of-concept MVP** - no authentication included
- Audio files are temporarily stored and deleted after processing
- All API calls run in parallel for optimal performance
- Feedback is rule-based (not AI-generated) for simplicity
- Error handling is basic - enhance for production use

## API Rate Limits

- **Whisper**: Subject to OpenAI account limits
- **Azure Speech**: Free tier = 5M characters/month

## License

See LICENSE file in project root.
