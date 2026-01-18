"""
VocoLabAI Backend API
FastAPI application for speech training with AI-powered feedback
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="VocoLabAI API",
    description="AI-Powered Speech Training Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        "database": "not configured",
        "services": {
            "whisper": "pending",
            "azure": "pending",
            "claude": "pending"
        }
    }

# TODO: Add audio processing endpoints
# TODO: Add user management endpoints
# TODO: Add session tracking endpoints
