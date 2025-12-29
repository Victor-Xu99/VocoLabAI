#!/usr/bin/env python3
"""
Simple test script for the VocoLabAI API
"""
import requests
import sys
from pathlib import Path


def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get("http://localhost:8000/health")
    
    if response.status_code == 200:
        print("✅ Health check passed")
        print(response.json())
    else:
        print(f"❌ Health check failed: {response.status_code}")
        sys.exit(1)


def test_transcribe(audio_file: str):
    """Test transcription endpoint"""
    print(f"\n🎤 Testing transcription with {audio_file}...")
    
    if not Path(audio_file).exists():
        print(f"❌ Audio file not found: {audio_file}")
        return
    
    with open(audio_file, "rb") as f:
        files = {"audio": f}
        response = requests.post("http://localhost:8000/api/transcribe", files=files)
    
    if response.status_code == 200:
        print("✅ Transcription successful")
        result = response.json()
        print(f"Transcription: {result['transcription']}")
    else:
        print(f"❌ Transcription failed: {response.status_code}")
        print(response.text)


def test_assess(audio_file: str, reference_text: str):
    """Test full assessment endpoint"""
    print(f"\n🎯 Testing pronunciation assessment...")
    print(f"Reference: {reference_text}")
    
    if not Path(audio_file).exists():
        print(f"❌ Audio file not found: {audio_file}")
        return
    
    with open(audio_file, "rb") as f:
        files = {"audio": f}
        data = {"reference_text": reference_text}
        response = requests.post("http://localhost:8000/api/assess", files=files, data=data)
    
    if response.status_code == 200:
        print("✅ Assessment successful")
        result = response.json()
        
        print(f"\n📊 Scores:")
        print(f"  Overall: {result['overall_score']}/100")
        print(f"  Pronunciation: {result['pronunciation_score']}/100")
        print(f"  Accuracy: {result['accuracy_score']}/100")
        print(f"  Fluency: {result['fluency_score']}/100")
        
        print(f"\n💬 Feedback: {result['feedback']}")
        
        print(f"\n💡 Tips:")
        for tip in result['tips']:
            print(f"  - {tip}")
        
        print(f"\n📝 Practice Sentences:")
        for sentence in result['practice_sentences']:
            print(f"  [{sentence['difficulty']}] {sentence['text']}")
    else:
        print(f"❌ Assessment failed: {response.status_code}")
        print(response.text)


if __name__ == "__main__":
    print("🚀 VocoLabAI API Test Script\n")
    
    # Test health
    test_health()
    
    # Check if audio file provided
    if len(sys.argv) > 1:
        audio_file = sys.argv[1]
        reference_text = sys.argv[2] if len(sys.argv) > 2 else "Hello world"
        
        # Test endpoints
        test_transcribe(audio_file)
        test_assess(audio_file, reference_text)
    else:
        print("\n📝 Usage:")
        print("  python test_api.py <audio_file> [reference_text]")
        print("\nExample:")
        print("  python test_api.py test.wav \"Hello world\"")
