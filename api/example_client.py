"""
Example client demonstrating how to interact with the VocoLabAI API
This shows how the frontend would integrate with the backend
"""
import httpx
import asyncio
from pathlib import Path


class VocoLabClient:
    """Simple async client for VocoLabAI API"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=60.0)
    
    async def health_check(self) -> dict:
        """Check if API is healthy"""
        response = await self.client.get(f"{self.base_url}/health")
        response.raise_for_status()
        return response.json()
    
    async def transcribe(self, audio_path: str) -> dict:
        """
        Transcribe audio using Whisper
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            dict with transcription and word timestamps
        """
        with open(audio_path, "rb") as f:
            files = {"audio": f}
            response = await self.client.post(
                f"{self.base_url}/api/transcribe",
                files=files
            )
        
        response.raise_for_status()
        return response.json()
    
    async def assess_pronunciation(self, audio_path: str, reference_text: str) -> dict:
        """
        Full pronunciation assessment
        
        Args:
            audio_path: Path to audio file
            reference_text: Expected text to pronounce
            
        Returns:
            Complete assessment with scores, errors, feedback, and practice sentences
        """
        with open(audio_path, "rb") as f:
            files = {"audio": f}
            data = {"reference_text": reference_text}
            response = await self.client.post(
                f"{self.base_url}/api/assess",
                files=files,
                data=data
            )
        
        response.raise_for_status()
        return response.json()
    
    async def close(self):
        """Close the client connection"""
        await self.client.aclose()


async def main():
    """Example usage"""
    client = VocoLabClient()
    
    try:
        # 1. Health check
        print("🔍 Checking API health...")
        health = await client.health_check()
        print(f"✅ Status: {health['status']}")
        
        # 2. Example: Transcribe audio
        audio_file = "test.wav"  # Replace with your audio file
        
        if Path(audio_file).exists():
            print(f"\n🎤 Transcribing {audio_file}...")
            transcription = await client.transcribe(audio_file)
            print(f"📝 Transcription: {transcription['transcription']}")
            
            # 3. Example: Full assessment
            reference = "Hello world, how are you today?"
            print(f"\n🎯 Assessing pronunciation...")
            print(f"Reference text: {reference}")
            
            assessment = await client.assess_pronunciation(audio_file, reference)
            
            print(f"\n📊 Results:")
            print(f"  Overall Score: {assessment['overall_score']}/100")
            print(f"  Pronunciation: {assessment['pronunciation_score']}/100")
            print(f"  Accuracy: {assessment['accuracy_score']}/100")
            print(f"  Fluency: {assessment['fluency_score']}/100")
            
            print(f"\n💬 Feedback:")
            print(f"  {assessment['feedback']}")
            
            print(f"\n💡 Tips:")
            for i, tip in enumerate(assessment['tips'], 1):
                print(f"  {i}. {tip}")
            
            print(f"\n📝 Practice Sentences:")
            for sentence in assessment['practice_sentences']:
                difficulty = sentence['difficulty_level']
                text = sentence['text']
                phonemes = ', '.join(sentence['target_phonemes'])
                print(f"  [{difficulty.upper()}] {text}")
                print(f"           Targets: {phonemes}")
            
            if assessment['word_errors']:
                print(f"\n⚠️  Errors detected:")
                for error in assessment['word_errors'][:3]:  # Show first 3
                    word = error['word']
                    error_type = error['error_type']
                    score = error['accuracy_score']
                    print(f"  - '{word}': {error_type} (accuracy: {score:.0f}%)")
        else:
            print(f"❌ Audio file not found: {audio_file}")
            print("💡 Place a test audio file and update the path")
    
    finally:
        await client.close()


if __name__ == "__main__":
    asyncio.run(main())
