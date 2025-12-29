from typing import List, Dict
import random


class FeedbackService:
    """Service for generating rule-based feedback (Claude replacement)"""
    
    def __init__(self):
        pass
    
    async def generate_feedback(
        self,
        reference_text: str,
        transcription: str,
        pronunciation_score: float,
        word_errors: List[Dict]
    ) -> dict:
        """
        Generate rule-based feedback and practice sentences
        
        Args:
            reference_text: The expected text
            transcription: What was actually said
            pronunciation_score: Overall pronunciation score
            word_errors: List of detected errors with phoneme details
            
        Returns:
            dict with feedback, tips, and practice sentences
        """
        # Generate feedback based on score
        feedback = self._generate_feedback_text(pronunciation_score, word_errors)
        
        # Generate tips
        tips = self._generate_tips(word_errors, pronunciation_score)
        
        # Generate practice sentences
        practice_sentences = self._generate_practice_sentences(word_errors)
        
        return {
            "feedback": feedback,
            "tips": tips,
            "practice_sentences": practice_sentences
        }
    
    def _generate_feedback_text(self, score: float, word_errors: List[Dict]) -> str:
        """Generate feedback based on score"""
        if score >= 90:
            return f"Excellent work! Your pronunciation is outstanding with a score of {score:.0f}/100. Keep practicing to maintain this level."
        elif score >= 75:
            return f"Great job! You scored {score:.0f}/100. Your pronunciation is clear with just a few minor issues to work on."
        elif score >= 60:
            return f"Good effort! You scored {score:.0f}/100. With some focused practice on the problem areas, you'll improve quickly."
        elif score >= 40:
            return f"You're making progress with a score of {score:.0f}/100. Focus on the specific sounds highlighted below and practice regularly."
        else:
            return f"Keep practicing! You scored {score:.0f}/100. Don't get discouraged - pronunciation takes time. Focus on one sound at a time."
    
    def _generate_tips(self, word_errors: List[Dict], score: float) -> List[str]:
        """Generate actionable tips based on errors"""
        tips = []
        
        # Collect problematic phonemes
        problem_phonemes = set()
        for error in word_errors[:3]:
            phonemes = error.get("phonemes", [])
            for p in phonemes:
                if p.get("accuracy_score", 100) < 60:
                    problem_phonemes.add(p.get("phoneme", ""))
        
        # Generate phoneme-specific tips
        phoneme_tips = {
            "θ": "Practice the 'th' sound by placing your tongue between your teeth",
            "ð": "For the voiced 'th', place tongue between teeth and add voice",
            "r": "Curl your tongue slightly back without touching the roof of your mouth",
            "l": "Place the tip of your tongue against the ridge behind your upper teeth",
            "s": "Keep your tongue near the roof of your mouth with air flowing through",
            "z": "Similar to 's' but add voice - feel the vibration",
        }
        
        for phoneme in list(problem_phonemes)[:2]:
            if phoneme in phoneme_tips:
                tips.append(phoneme_tips[phoneme])
        
        # Add general tips
        if score < 70:
            tips.append("Try speaking more slowly to improve clarity and accuracy")
        
        if len(tips) < 3:
            tips.append("Record yourself and compare with native speakers")
        
        if len(tips) < 3:
            tips.append("Practice the difficult words repeatedly in isolation")
        
        return tips[:3]
    
    def _generate_practice_sentences(self, word_errors: List[Dict]) -> List[Dict]:
        """Generate practice sentences targeting problem areas"""
        # Collect problematic phonemes
        problem_phonemes = set()
        for error in word_errors[:3]:
            phonemes = error.get("phonemes", [])
            for p in phonemes:
                if p.get("accuracy_score", 100) < 60:
                    problem_phonemes.add(p.get("phoneme", ""))
        
        # Sentence templates by phoneme
        sentence_templates = {
            "θ": [
                ("The cat thinks about math", ["θ"], "easy"),
                ("Three things are better than nothing", ["θ"], "medium"),
                ("Thoughtful mathematicians think through theories", ["θ"], "hard"),
            ],
            "ð": [
                ("The dog is over there", ["ð"], "easy"),
                ("This and that are the same", ["ð"], "medium"),
                ("They gathered together with their brothers", ["ð"], "hard"),
            ],
            "r": [
                ("The red car runs fast", ["r"], "easy"),
                ("Robert wrote a really great report", ["r"], "medium"),
                ("Rory's rare barrel of berries arrived", ["r"], "hard"),
            ],
            "s": [
                ("Six snakes sit still", ["s"], "easy"),
                ("She sells seashells by the seashore", ["s"], "medium"),
                ("Specifically, the scientist's systematic analysis succeeded", ["s"], "hard"),
            ],
        }
        
        # Generate sentences for problem phonemes
        sentences = []
        used_phonemes = []
        
        for phoneme in list(problem_phonemes)[:2]:
            if phoneme in sentence_templates:
                # Pick one random sentence for this phoneme
                template = random.choice(sentence_templates[phoneme])
                sentences.append({
                    "text": template[0],
                    "target_phonemes": template[1],
                    "difficulty_level": template[2]
                })
                used_phonemes.append(phoneme)
        
        # Fill with general practice sentences if needed
        general_sentences = [
            ("How are you today?", [], "easy"),
            ("Practice makes perfect every day", [], "medium"),
            ("The quick brown fox jumps over the lazy dog", [], "hard"),
        ]
        
        while len(sentences) < 3:
            sentences.append({
                "text": general_sentences[len(sentences)][0],
                "target_phonemes": general_sentences[len(sentences)][1],
                "difficulty_level": general_sentences[len(sentences)][2]
            })
        
        return sentences[:3]
