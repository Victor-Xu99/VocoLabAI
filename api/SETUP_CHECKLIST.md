# 🚀 VocoLabAI Backend - Setup Checklist

## Prerequisites
- [ ] Python 3.11+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## API Keys Required
- [ ] OpenAI API key (for Whisper)
- [ ] Azure Speech Services key + region
- [ ] Anthropic API key (for Claude)

## Setup Steps

### 1. Environment Setup
```bash
cd api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
- [ ] Virtual environment created
- [ ] Dependencies installed

### 2. Configuration
```bash
cp .env.example .env
# Edit .env with your API keys
```
- [ ] .env file created
- [ ] OPENAI_API_KEY added
- [ ] AZURE_SPEECH_KEY added
- [ ] AZURE_SPEECH_REGION added
- [ ] ANTHROPIC_API_KEY added
- [ ] FRONTEND_URL configured (default: http://localhost:3000)

### 3. Test the Server
```bash
python main.py
```
- [ ] Server starts without errors
- [ ] Can access http://localhost:8000
- [ ] API docs available at http://localhost:8000/docs

### 4. Verify API Keys
```bash
curl http://localhost:8000/health
```
Expected response:
```json
{
  "status": "healthy",
  "services": {
    "whisper": "configured",
    "azure": "configured",
    "claude": "configured"
  }
}
```
- [ ] Health check passes

### 5. Test with Audio (Optional)
```bash
# If you have a test audio file:
python test_api.py your_audio.wav "Test sentence"
```
- [ ] Transcription works
- [ ] Assessment completes
- [ ] Feedback is generated

## Troubleshooting

### Issue: Module not found
```bash
pip install -r requirements.txt
```

### Issue: API key errors
- Check .env file is in api/ directory
- Verify all keys are set correctly
- Remove any quotes around keys
- Restart server after changing .env

### Issue: Azure recognition failed
- Verify AZURE_SPEECH_REGION matches your resource
- Check audio format (WAV or MP3)
- Ensure audio is clear and audible

### Issue: CORS errors (from frontend)
- Verify FRONTEND_URL in .env matches your frontend
- Default should be http://localhost:3000

## Next Steps After Setup

1. **Test the API**
   - Use Swagger UI at http://localhost:8000/docs
   - Try test_api.py script
   - Test with cURL commands

2. **Integrate with Frontend**
   - Update frontend API URL
   - Test file upload from frontend
   - Verify CORS is working

3. **Deploy (Optional)**
   - Railway: Push to GitHub, connect repo
   - Render: Connect GitHub, add env vars
   - Set environment variables on platform

## Quick Reference

**Start Server:**
```bash
cd api
source venv/bin/activate
python main.py
```

**Stop Server:**
- Press Ctrl+C in terminal

**View Logs:**
- Check terminal output
- Logs show all API requests

**API Endpoints:**
- GET /health - Health check
- POST /api/assess - Full assessment
- POST /api/transcribe - Transcription only

## Files to Check

- [x] requirements.txt - All dependencies listed
- [x] main.py - FastAPI application
- [x] config.py - Configuration management
- [x] models.py - Data models
- [x] analyzer.py - Error analysis
- [x] services/ - AI integrations
- [x] .env.example - Environment template
- [x] README.md - Full documentation
- [x] QUICKSTART.md - Quick reference

## Status

- [ ] Setup complete
- [ ] API keys configured
- [ ] Server running
- [ ] Health check passing
- [ ] Ready for testing
- [ ] Ready for frontend integration

## Need Help?

1. Check [README.md](README.md) for detailed documentation
2. Check [QUICKSTART.md](QUICKSTART.md) for quick reference
3. View interactive docs at http://localhost:8000/docs
4. Review example_client.py for integration examples

---

**Estimated Setup Time:** 5-10 minutes

**Once complete, you'll have:**
✅ Fully functional backend API
✅ AI-powered pronunciation assessment
✅ Personalized feedback generation
✅ Ready for frontend integration
