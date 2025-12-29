from pydantic import BaseModel
from typing import List, Optional


class PhonemeError(BaseModel):
    """Represents a phoneme-level pronunciation error"""
    phoneme: str
    position: int
    expected: str
    actual: str
    accuracy_score: Optional[float] = None


class WordError(BaseModel):
    """Represents a word-level error"""
    word: str
    position: int
    error_type: str  # 'mispronunciation', 'omission', 'insertion'
    accuracy_score: Optional[float] = None
    phoneme_errors: List[PhonemeError] = []


class PracticeSentence(BaseModel):
    """A practice sentence targeting specific phonemes"""
    text: str
    target_phonemes: List[str]
    difficulty_level: str


class AssessmentResponse(BaseModel):
    """Complete assessment response"""
    transcription: str
    reference_text: str
    overall_score: float
    pronunciation_score: float
    accuracy_score: float
    fluency_score: float
    completeness_score: float
    word_errors: List[WordError]
    feedback: str
    tips: List[str]
    practice_sentences: List[PracticeSentence]
