import azure.cognitiveservices.speech as speechsdk
from config import settings
import json


class AzureSpeechService:
    """Service for pronunciation assessment using Azure Speech Services"""
    
    def __init__(self):
        self.speech_config = speechsdk.SpeechConfig(
            subscription=settings.azure_speech_key,
            region=settings.azure_speech_region
        )
    
    async def assess_pronunciation(self, audio_file_path: str, reference_text: str) -> dict:
        """
        Assess pronunciation quality using Azure Speech Services
        
        Args:
            audio_file_path: Path to the audio file
            reference_text: The expected text to compare against
            
        Returns:
            dict with pronunciation scores and phoneme-level analysis
        """
        # Configure audio input
        audio_config = speechsdk.audio.AudioConfig(filename=audio_file_path)
        
        # Configure pronunciation assessment
        pronunciation_config = speechsdk.PronunciationAssessmentConfig(
            reference_text=reference_text,
            grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
            granularity=speechsdk.PronunciationAssessmentGranularity.Phoneme,
            enable_miscue=True
        )
        
        # Create speech recognizer
        speech_recognizer = speechsdk.SpeechRecognizer(
            speech_config=self.speech_config,
            audio_config=audio_config
        )
        
        # Apply pronunciation assessment config
        pronunciation_config.apply_to(speech_recognizer)
        
        # Perform recognition
        result = speech_recognizer.recognize_once()
        
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            pronunciation_result = speechsdk.PronunciationAssessmentResult(result)
            
            return {
                "accuracy_score": pronunciation_result.accuracy_score,
                "pronunciation_score": pronunciation_result.pronunciation_score,
                "completeness_score": pronunciation_result.completeness_score,
                "fluency_score": pronunciation_result.fluency_score,
                "recognized_text": result.text,
                "words": self._parse_word_level_results(result)
            }
        else:
            return {
                "error": f"Recognition failed: {result.reason}",
                "accuracy_score": 0,
                "pronunciation_score": 0,
                "completeness_score": 0,
                "fluency_score": 0,
                "words": []
            }
    
    def _parse_word_level_results(self, result) -> list:
        """Parse word-level pronunciation assessment results"""
        words = []
        
        # Parse JSON result for detailed word/phoneme information
        result_json = json.loads(result.properties.get(
            speechsdk.PropertyId.SpeechServiceResponse_JsonResult
        ))
        
        nb_result = result_json.get("NBest", [{}])[0]
        word_results = nb_result.get("Words", [])
        
        for word_result in word_results:
            word_info = {
                "word": word_result.get("Word", ""),
                "accuracy_score": word_result.get("PronunciationAssessment", {}).get("AccuracyScore", 0),
                "error_type": word_result.get("PronunciationAssessment", {}).get("ErrorType", "None"),
                "phonemes": []
            }
            
            # Extract phoneme-level details
            phonemes = word_result.get("Phonemes", [])
            for phoneme in phonemes:
                phoneme_info = {
                    "phoneme": phoneme.get("Phoneme", ""),
                    "accuracy_score": phoneme.get("PronunciationAssessment", {}).get("AccuracyScore", 0)
                }
                word_info["phonemes"].append(phoneme_info)
            
            words.append(word_info)
        
        return words
