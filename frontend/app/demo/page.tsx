"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PlayCircle,
  Mic,
  Square,
  RotateCcw,
  Loader2,
  ArrowRight,
  Star,
  Heart,
  Trophy,
  Sparkles,
  Volume2,
  Target,
} from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Footer } from "@/components/ui/footer-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Speech therapy sentences targeting specific phonemes
interface PracticeSentence {
  sentence: string;
  targetPhoneme: string;
  phonemeLabel: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
}

const practiceSentences: PracticeSentence[] = [
  // /θ/ (voiceless th) - Frontal lisp target
  { sentence: "Think about the weather", targetPhoneme: "θ", phonemeLabel: "TH (think)", description: "Practice /θ/ sound", difficulty: "medium" },
  { sentence: "Three free throws", targetPhoneme: "θ", phonemeLabel: "TH (three)", description: "Practice /θ/ sound", difficulty: "easy" },
  { sentence: "Theophilus Thistle the successful thistle sifter", targetPhoneme: "θ", phonemeLabel: "TH (thistle)", description: "Practice /θ/ sound", difficulty: "hard" },
  
  // /ð/ (voiced th) - Frontal lisp target
  { sentence: "The three brothers", targetPhoneme: "ð", phonemeLabel: "TH (the)", description: "Practice /ð/ sound", difficulty: "easy" },
  { sentence: "This thing is smooth", targetPhoneme: "ð", phonemeLabel: "TH (this)", description: "Practice /ð/ sound", difficulty: "medium" },
  { sentence: "The weather is thoroughly unpredictable", targetPhoneme: "ð", phonemeLabel: "TH (weather)", description: "Practice /ð/ sound", difficulty: "hard" },
  
  // /r/ - Rhotacism target
  { sentence: "Red roses run rapidly", targetPhoneme: "r", phonemeLabel: "R (red)", description: "Practice /r/ sound", difficulty: "easy" },
  { sentence: "Round the rugged rock", targetPhoneme: "r", phonemeLabel: "R (round)", description: "Practice /r/ sound", difficulty: "medium" },
  { sentence: "The rabbit ran around the room", targetPhoneme: "r", phonemeLabel: "R (rabbit)", description: "Practice /r/ sound", difficulty: "medium" },
  
  // /l/ - Liquid sound target
  { sentence: "Light the lamp", targetPhoneme: "l", phonemeLabel: "L (light)", description: "Practice /l/ sound", difficulty: "easy" },
  { sentence: "Red leather yellow leather", targetPhoneme: "l", phonemeLabel: "L (leather)", description: "Practice /l/ sound", difficulty: "medium" },
  { sentence: "The little lady loves lollipops", targetPhoneme: "l", phonemeLabel: "L (lady)", description: "Practice /l/ sound", difficulty: "hard" },
  
  // /s/ - Sibilant target
  { sentence: "She sells sea shells", targetPhoneme: "s", phonemeLabel: "S (sells)", description: "Practice /s/ sound", difficulty: "easy" },
  { sentence: "Six slippery snails slid slowly seaward", targetPhoneme: "s", phonemeLabel: "S (slippery)", description: "Practice /s/ sound", difficulty: "medium" },
  
  // /ʃ/ (sh) - Sibilant target
  { sentence: "She sells shiny shells", targetPhoneme: "ʃ", phonemeLabel: "SH (she)", description: "Practice /ʃ/ sound", difficulty: "easy" },
  { sentence: "The shop has fresh fish", targetPhoneme: "ʃ", phonemeLabel: "SH (shop)", description: "Practice /ʃ/ sound", difficulty: "medium" },
  { sentence: "Shush, the sheep are sleeping", targetPhoneme: "ʃ", phonemeLabel: "SH (shush)", description: "Practice /ʃ/ sound", difficulty: "hard" },
];

function getRandomSentences(count: number): PracticeSentence[] {
  const shuffled = [...practiceSentences].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, practiceSentences.length));
}

// Gamification state
interface GameState {
  xp: number;
  hearts: number;
  stars: number;
  streak: number;
  level: number;
  currentLesson: number;
  totalLessons: number;
}

type DemoState =
  | "idle"
  | "recording"
  | "processing"
  | "completed"
  | "finished";

export default function DemoPage() {
  const [state, setState] = useState<DemoState>("idle");
  const [sentenceList, setSentenceList] = useState<PracticeSentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [currentSentence, setCurrentSentence] = useState<PracticeSentence | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastScore, setLastScore] = useState<number>(0);
  const [playAudio, setPlayAudio] = useState(false);

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    xp: 0,
    hearts: 5,
    stars: 0,
    streak: 0,
    level: 1,
    currentLesson: 0,
    totalLessons: 5,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Calculate progress percentage
  const progressPercent = (gameState.currentLesson / gameState.totalLessons) * 100;

  // Award points and update game state
  const awardPoints = (score: number) => {
    const xpGain = Math.floor(score / 10);
    const starsGain = score >= 80 ? 3 : score >= 60 ? 2 : score >= 40 ? 1 : 0;
    const newStreak = score >= 70 ? gameState.streak + 1 : 0;
    
    setGameState((prev) => ({
      ...prev,
      xp: prev.xp + xpGain,
      stars: prev.stars + starsGain,
      streak: newStreak,
      currentLesson: Math.min(prev.currentLesson + 1, prev.totalLessons),
      level: Math.floor((prev.xp + xpGain) / 100) + 1,
    }));

    if (score >= 80) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setError(null);

      const isSecureContext =
        window.isSecureContext ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "https:";

      if (!isSecureContext) {
        setError("Microphone access requires HTTPS. Please use HTTPS or run on localhost.");
        setState("idle");
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Your browser doesn't support microphone access.");
        setState("idle");
        return;
      }

      if (sentenceList.length === 0) {
        const sentences = getRandomSentences(5);
        setSentenceList(sentences);
        setCurrentSentenceIndex(0);
        setCurrentSentence(sentences[0]);
      } else {
        setCurrentSentence(sentenceList[currentSentenceIndex]);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let mimeType = "audio/webm;codecs=opus";
      const types = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];

      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState("processing");
      };

      mediaRecorder.start();
      setState("recording");
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setError("Failed to access microphone. Please check your permissions.");
      setState("idle");
    }
  };

  const startDemo = async () => {
    await startRecording();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const handleComplete = () => {
    // Simulate score (in real app, this would come from API)
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    setLastScore(score);
    awardPoints(score);
    setState("completed");
  };

  useEffect(() => {
    if (state === "processing") {
      const timer = setTimeout(() => {
        handleComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const nextSentence = async () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBlob(null);
    setRecordingTime(0);

    const nextIndex = currentSentenceIndex + 1;
    if (nextIndex >= sentenceList.length) {
      setState("finished");
    } else {
      setCurrentSentenceIndex(nextIndex);
      setCurrentSentence(sentenceList[nextIndex]);
      await startRecording();
    }
  };

  const resetDemo = () => {
    setState("idle");
    setSentenceList([]);
    setCurrentSentenceIndex(0);
    setCurrentSentence(null);
    setRecordingTime(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setError(null);
    setGameState({
      xp: 0,
      hearts: 5,
      stars: 0,
      streak: 0,
      level: 1,
      currentLesson: 0,
      totalLessons: 5,
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🌟";
    if (score >= 80) return "⭐";
    if (score >= 70) return "👍";
    if (score >= 60) return "😊";
    return "💪";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Amazing! You're a superstar!";
    if (score >= 80) return "Great job! Keep it up!";
    if (score >= 70) return "Good work! You're improving!";
    if (score >= 60) return "Nice try! Practice makes perfect!";
    return "Keep practicing! You're doing great!";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100 border-green-300";
      case "medium": return "text-blue-600 bg-blue-100 border-blue-300";
      case "hard": return "text-orange-600 bg-orange-100 border-orange-300";
      default: return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold text-blue-600"
              >
                Excellent Work!
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-24 pb-16">
        {/* Game Stats Bar */}
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Hearts */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Lives:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Heart
                      key={i}
                      className={cn(
                        "w-6 h-6 transition-all",
                        i < gameState.hearts ? "fill-red-500 text-red-500 hover:scale-110" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* XP */}
              <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Level {gameState.level}
                </span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden group relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(gameState.xp % 100)}%` }}
                    className="h-full bg-yellow-500"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-100 rounded-full" />
                </div>
                <span className="text-xs text-gray-600 font-semibold">{gameState.xp} XP</span>
              </div>

              {/* Streak */}
              {gameState.streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1"
                >
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-semibold text-orange-600">
                    {gameState.streak} 🔥 Streak!
                  </span>
                </motion.div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Lesson Progress</span>
                <span className="text-sm text-gray-600">
                  {gameState.currentLesson} / {gameState.totalLessons}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-blue-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold text-gray-700">
                    {Math.round(progressPercent)}% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            {state === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center space-y-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                  onClick={startDemo}
                >
                  <PlayCircle className="w-12 h-12 text-white" />
                </motion.div>
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">Ready to Practice? 🎯</h2>
                  <p className="text-gray-600 text-lg">
                    Let's practice speech sounds together!
                  </p>
                </div>
                <Button
                  onClick={startDemo}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <PlayCircle className="w-6 h-6 mr-2" />
                  Start Practice
                </Button>
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 max-w-md w-full">
                    <p className="text-red-800 font-semibold">{error}</p>
                  </div>
                )}
              </motion.div>
            )}

            {state === "recording" && currentSentence && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-6"
              >
                <div className="text-center mb-4">
                  <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-blue-200">
                    Lesson {gameState.currentLesson + 1} of {gameState.totalLessons}
                  </div>
                </div>

                {/* Target Phoneme Info */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 w-full max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Target Sound:</span>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full border font-semibold",
                      getDifficultyColor(currentSentence.difficulty)
                    )}>
                      {currentSentence.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-bold text-blue-700">
                      {currentSentence.phonemeLabel} - {currentSentence.description}
                    </span>
                  </div>
                </div>

                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
                  <div className="relative w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:bg-red-600 transition-colors"
                    onClick={stopRecording}>
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">Speak Now! 🎤</h2>
                  <p className="text-lg font-mono text-blue-600 font-semibold">
                    {formatTime(recordingTime)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-2xl border-2 border-blue-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPlayAudio(!playAudio)}
                      className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <Volume2 className="w-5 h-5 text-blue-600" />
                    </motion.button>
                    <p className="text-sm text-gray-600">Click to hear the sentence</p>
                  </div>
                  <p className="text-2xl font-bold text-center text-gray-900 mb-2">
                    Say this sentence:
                  </p>
                  <motion.p
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-center text-blue-600"
                  >
                    "{currentSentence.sentence}"
                  </motion.p>
                </div>

                <Button
                  onClick={stopRecording}
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Square className="w-6 h-6 mr-2" />
                  Stop Recording
                </Button>
              </motion.div>
            )}

            {state === "processing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center space-y-6"
              >
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <h2 className="text-2xl font-bold text-gray-900">Listening... 👂</h2>
                <p className="text-gray-600">We're checking how you did!</p>
              </motion.div>
            )}

            {state === "completed" && currentSentence && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-6"
              >
                {/* Score Display */}
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-6xl"
                  >
                    {getScoreEmoji(lastScore)}
                  </motion.div>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {getScoreMessage(lastScore)}
                  </motion.h2>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-blue-600 text-white rounded-2xl p-6 shadow-xl"
                  >
                    <p className="text-5xl font-bold">{lastScore}%</p>
                    <p className="text-lg mt-2">Your Score!</p>
                  </motion.div>
                </div>

                {/* Phoneme Feedback */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 w-full max-w-md">
                  <p className="text-sm font-semibold text-gray-700 mb-2">You practiced:</p>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-bold text-blue-700">
                      {currentSentence.phonemeLabel}
                    </span>
                  </div>
                </div>

                {/* Stars Earned */}
                {lastScore >= 60 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <Star
                          className={cn(
                            "w-10 h-10 cursor-pointer hover:scale-110 transition-transform",
                            i < Math.floor(lastScore / 30)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* XP Gained */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 hover:bg-yellow-100 transition-colors cursor-pointer"
                  onClick={() => console.log("XP details")}
                >
                  <p className="text-center text-yellow-700 font-semibold">
                    +{Math.floor(lastScore / 10)} XP Earned! 🎉
                  </p>
                </motion.div>

                {audioUrl && (
                  <div className="w-full max-w-md">
                    <audio ref={audioRef} src={audioUrl} controls className="w-full rounded-lg" />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={nextSentence}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Next Lesson
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {state === "finished" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-6"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-8xl cursor-pointer hover:scale-110 transition-transform"
                >
                  🏆
                </motion.div>
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-gray-900">
                    Amazing Work! 🎉
                  </h2>
                  <p className="text-xl text-gray-600">
                    You completed all {sentenceList.length} lessons!
                  </p>
                  <div className="bg-yellow-100 border-2 border-yellow-300 rounded-2xl p-6 shadow-lg mt-4 hover:bg-yellow-200 transition-colors">
                    <p className="text-2xl font-bold text-yellow-800">Total XP: {gameState.xp}</p>
                    <p className="text-lg mt-2 text-yellow-700">Level {gameState.level}</p>
                  </div>
                </div>
                <Button
                  onClick={resetDemo}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <RotateCcw className="w-6 h-6 mr-2" />
                  Practice Again
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}