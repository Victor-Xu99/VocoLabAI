from typing import List, Dict
from models import WordError, PhonemeError


class ErrorAnalyzer:
    """Analyzes pronunciation errors and identifies patterns"""
    
    @staticmethod
    def analyze_errors(
        reference_text: str,
        transcription: str,
        azure_words: List[Dict]
    ) -> List[WordError]:
        """
        Analyze pronunciation errors from Azure results
        
        Args:
            reference_text: Expected text
            transcription: Actual transcribed text
            azure_words: Word-level results from Azure
            
        Returns:
            List of WordError objects
        """
        word_errors = []
        
        for idx, word_result in enumerate(azure_words):
            word = word_result.get("word", "")
            accuracy = word_result.get("accuracy_score", 100)
            error_type = word_result.get("error_type", "None")
            
            # Only include words with errors
            if error_type != "None" or accuracy < 80:
                phoneme_errors = ErrorAnalyzer._extract_phoneme_errors(
                    word_result.get("phonemes", [])
                )
                
                word_error = WordError(
                    word=word,
                    position=idx,
                    error_type=error_type.lower() if error_type != "None" else "mispronunciation",
                    accuracy_score=accuracy,
                    phoneme_errors=phoneme_errors
                )
                word_errors.append(word_error)
        
        return word_errors
    
    @staticmethod
    def _extract_phoneme_errors(phonemes: List[Dict]) -> List[PhonemeError]:
        """Extract phoneme-level errors"""
        phoneme_errors = []
        
        for idx, phoneme_result in enumerate(phonemes):
            phoneme = phoneme_result.get("phoneme", "")
            accuracy = phoneme_result.get("accuracy_score", 100)
            
            # Flag phonemes with low accuracy
            if accuracy < 60:
                phoneme_error = PhonemeError(
                    phoneme=phoneme,
                    position=idx,
                    expected=phoneme,
                    actual="unclear",  # Azure doesn't provide the actual phoneme
                    accuracy_score=accuracy
                )
                phoneme_errors.append(phoneme_error)
        
        return phoneme_errors
    
    @staticmethod
    def calculate_overall_score(
        pronunciation_score: float,
        accuracy_score: float,
        fluency_score: float,
        completeness_score: float
    ) -> float:
        """Calculate weighted overall score"""
        # Weighted average
        overall = (
            pronunciation_score * 0.4 +
            accuracy_score * 0.3 +
            fluency_score * 0.2 +
            completeness_score * 0.1
        )
        return round(overall, 2)
