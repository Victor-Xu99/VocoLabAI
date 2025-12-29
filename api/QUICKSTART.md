# VocoLabAI Backend - Quick Start Guide

## 🚀 Getting Started (3 Steps)

### 1. Install Dependencies
```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Set Up API Keys
```bash
cp .env.example .env
# Edit .env and add your API keys
```

**Required API Keys:**
- **OpenAI** (Whisper): https://platform.openai.com/api-keys
- **Azure Speech**: https://portal.azure.com/
- **Anthropic** (Claude): https://console.anthropic.com/

### 3. Run the Server
```bash
python main.py
# Or use the startup script:
./start.sh
```

Server runs at: http://localhost:8000

API Docs: http://localhost:8000/docs

---

## 📡 API Usage

### Test with cURL
```bash
# Simple transcription
curl -X POST http://localhost:8000/api/transcribe \
  -F "audio=@your_audio.wav"

# Full assessment
curl -X POST http://localhost:8000/api/assess \
  -F "audio=@your_audio.wav" \
  -F "reference_text=The quick brown fox"
```

### Test with Python
```bash
python test_api.py your_audio.wav "The quick brown fox"
```

### Frontend Integration
```typescript
// Example from Next.js frontend
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.wav');
formData.append('reference_text', 'Hello world');

const response = await fetch('http://localhost:8000/api/assess', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result.overall_score, result.feedback);
```

---

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ (Next.js on port 3000)
└──────┬──────┘
       │ POST /api/assess
       │ {audio + reference_text}
       ↓
┌─────────────┐
│  FastAPI    │ (Python on port 8000)
└──────┬──────┘
       │
       ├─→ Whisper API (transcription)
       ├─→ Azure Speech (pronunciation scores)
       └─→ Claude AI (feedback generation)
       │
       ↓
┌─────────────┐
│  Response   │ {scores, errors, feedback, practice_sentences}
└─────────────┘
```

---

## 📁 File Structure

```
api/
├── main.py              # FastAPI app + endpoints
├── config.py            # Settings & env vars
├── models.py            # Data models
├── analyzer.py          # Error analysis logic
├── services/
│   ├── whisper_service.py
│   ├── azure_service.py
│   └── claude_service.py
├── requirements.txt
├── .env                 # Your API keys (create this)
├── start.sh             # Startup script
└── test_api.py          # Testing script
```

---

## 🧪 Testing

```bash
# 1. Check if server is running
curl http://localhost:8000/health

# 2. Test with audio file
python test_api.py test.wav "Hello world"

# 3. Interactive API docs
open http://localhost:8000/docs
```

---

## ⚙️ Configuration

Edit `.env`:
```bash
# OpenAI (for Whisper transcription)
OPENAI_API_KEY=sk-...

# Azure Speech Services
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=eastus

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

**Issue: "Module not found"**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**Issue: "API key not found"**
- Check `.env` file exists in `api/` directory
- Verify all keys are set correctly
- Restart the server after changing `.env`

**Issue: "CORS error"**
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Default is `http://localhost:3000`

**Issue: "Azure recognition failed"**
- Verify `AZURE_SPEECH_REGION` matches your Azure resource region
- Ensure audio is clear and in supported format (WAV, MP3)

---

## 📊 Response Format

```json
{
  "transcription": "What the user said",
  "reference_text": "What they should say",
  "overall_score": 85.5,
  "pronunciation_score": 88.0,
  "accuracy_score": 90.0,
  "fluency_score": 82.0,
  "completeness_score": 95.0,
  "word_errors": [
    {
      "word": "example",
      "position": 0,
      "error_type": "mispronunciation",
      "accuracy_score": 65.0,
      "phoneme_errors": [...]
    }
  ],
  "feedback": "Great job! Your pronunciation...",
  "tips": [
    "Focus on the 'th' sound...",
    "Practice stressed syllables...",
    "Try speaking more slowly..."
  ],
  "practice_sentences": [
    {
      "text": "The cat sat on the mat",
      "target_phonemes": ["th"],
      "difficulty_level": "easy"
    }
  ]
}
```

---

## 🚢 Deployment

### Railway
1. Push to GitHub
2. Connect repo in Railway
3. Add environment variables
4. Deploy automatically

### Render
1. Connect repo
2. Select Python environment
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## 📝 Notes

- MVP version - no authentication
- Audio files are temporary (auto-deleted)
- Parallel API calls for speed
- All scores are 0-100 scale

## 🔗 Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text)
- [Azure Speech SDK](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/)
- [Anthropic Claude](https://docs.anthropic.com/)
