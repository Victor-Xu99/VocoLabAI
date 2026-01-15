"use client";

import { useState, useRef, useEffect } from "react";
import {
  PlayCircle,
  Mic,
  Square,
  RotateCcw,
  Loader2,
  ArrowRight,
  Brain,
  Activity,
} from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Footer } from "@/components/ui/footer-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Random sentences for pronunciation practice
const practiceSentences = [
  "Think about the weather",
  "The quick brown fox jumps over the lazy dog",
  "She sells seashells by the seashore",
  "How much wood would a woodchuck chuck",
  "Peter Piper picked a peck of pickled peppers",
  "Red lorry yellow lorry",
  "Unique New York",
  "The thirty-three thieves thought that they thrilled the throne",
  "I saw a kitten eating chicken in the kitchen",
  "Six slippery snails slid slowly seaward",
  "Betty bought a bit of butter",
  "A proper copper coffee pot",
  "Theophilus Thistle the successful thistle sifter",
  "Three free throws",
  "Fuzzy Wuzzy was a bear",
];

function getRandomSentences(count: number): string[] {
  const shuffled = [...practiceSentences].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, practiceSentences.length));
}

// Exercise instructions
const exerciseInstructions = [
  "Read slowly",
  "Read and pause between every syllable",
  "Emphasize each word clearly",
  "Read with exaggerated pronunciation",
  "Read at a normal pace",
];

// Exercise feedback messages
const exerciseFeedback = {
  slow: [
    "That was a little fast, try it even slower",
    "Try reading it more slowly",
    "Take your time, read it slower",
    "That sounded good, but try going even slower",
  ],
  fast: [
    "That was a little slow, try picking up the pace",
    "Try reading it a bit faster",
    "Good, but try speeding up a little",
  ],
  perfect: [
    "That sounded perfect!",
    "Excellent! That was great!",
    "Perfect pronunciation!",
    "That was spot on!",
    "Wonderful! Keep it up!",
  ],
  general: [
    "Good attempt, try again with more emphasis",
    "Try pausing more between words",
    "Focus on clarity, try again",
    "Good, but try to be more precise",
  ],
};

function getExerciseFeedbackMessage(instruction: string): string {
  // Determine feedback based on instruction or random
  const instructionLower = instruction.toLowerCase();

  if (instructionLower.includes("slow")) {
    // For slow instructions, might be too fast
    const feedbacks = [
      ...exerciseFeedback.slow,
      ...exerciseFeedback.perfect, // Sometimes it's perfect
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  } else if (
    instructionLower.includes("pause") ||
    instructionLower.includes("syllable")
  ) {
    // For pause/syllable instructions
    const feedbacks = [
      ...exerciseFeedback.general,
      ...exerciseFeedback.perfect,
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  } else {
    // General feedback - mix of all types
    const allFeedbacks = [
      ...exerciseFeedback.slow,
      ...exerciseFeedback.fast,
      ...exerciseFeedback.perfect,
      ...exerciseFeedback.general,
    ];
    return allFeedbacks[Math.floor(Math.random() * allFeedbacks.length)];
  }
}

function getRandomExercises(
  count: number
): Array<{ sentence: string; instruction: string }> {
  const shuffled = [...practiceSentences].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, practiceSentences.length));
  return selected.map((sentence) => ({
    sentence,
    instruction:
      exerciseInstructions[
        Math.floor(Math.random() * exerciseInstructions.length)
      ],
  }));
}

type DemoState =
  | "idle"
  | "recording"
  | "processing"
  | "completed"
  | "exercises"
  | "analyzing"
  | "diagnosis"
  | "finished";

export default function DemoPage() {
  const [state, setState] = useState<DemoState>("idle");
  const [sentenceList, setSentenceList] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [retriesRemaining, setRetriesRemaining] = useState<number>(2);
  const [sentence, setSentence] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [exerciseList, setExerciseList] = useState<
    Array<{ sentence: string; instruction: string }>
  >([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [exerciseFeedback, setExerciseFeedback] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle analyzing -> diagnosis transition after 3 seconds
  useEffect(() => {
    if (state === "analyzing") {
      const timer = window.setTimeout(() => {
        // Generate a random diagnosis (for demo purposes)
        const diagnoses = [
          "It sounds like you have a slight lisp",
          "You may have difficulty with 'th' sounds",
          "Your pronunciation shows minor issues with 'r' sounds",
          "There are some challenges with consonant clusters",
          "You might benefit from focusing on vowel clarity",
        ];
        const randomDiagnosis =
          diagnoses[Math.floor(Math.random() * diagnoses.length)];
        setDiagnosis(randomDiagnosis);
        setState("diagnosis");
      }, 3000);

      return () => window.clearTimeout(timer);
    }
  }, [state]);

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

  const startRecording = async (isRetry: boolean = false) => {
    try {
      setError(null);

      // Check if we're in a secure context (HTTPS or localhost)
      const isSecureContext =
        window.isSecureContext ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "https:";

      if (!isSecureContext) {
        setError(
          "Microphone access requires HTTPS. Please use HTTPS or run on localhost."
        );
        setState("idle");
        return;
      }

      // Check if MediaRecorder is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(
          "Your browser doesn't support microphone access. Please use a modern browser like Chrome, Firefox, or Edge."
        );
        setState("idle");
        return;
      }

      // Generate 10 random sentences if starting fresh (not retrying)
      if (!isRetry && sentenceList.length === 0) {
        const sentences = getRandomSentences(10);
        setSentenceList(sentences);
        setCurrentSentenceIndex(0);
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Use current sentence from list (either regular sentences or exercises)
      let currentSentence = "";
      if (exerciseList.length > 0) {
        // In exercises mode
        if (currentExerciseIndex >= exerciseList.length) {
          setError("No more exercises available.");
          setState("exercises");
          return;
        }
        currentSentence = exerciseList[currentExerciseIndex].sentence;
      } else {
        // Regular sentence mode
        const sentencesToUse = sentenceList.length > 0 ? sentenceList : [];
        if (sentencesToUse.length === 0) {
          setError("No sentences available. Please refresh the page.");
          setState("idle");
          return;
        }
        currentSentence = sentencesToUse[currentSentenceIndex];
      }
      setSentence(currentSentence);

      // Find supported mimeType
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

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Generate feedback for exercises
        if (exerciseList.length > 0 && exerciseList[currentExerciseIndex]) {
          const feedback = getExerciseFeedbackMessage(
            exerciseList[currentExerciseIndex].instruction
          );
          setExerciseFeedback(feedback);
        }

        setState("completed");
      };

      // Start recording
      mediaRecorder.start();
      setState("recording");
      setRecordingTime(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);

      let errorMessage = "Failed to access microphone. ";

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        errorMessage +=
          "Please allow microphone access in your browser settings and try again.";
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        errorMessage +=
          "No microphone found. Please connect a microphone and try again.";
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        errorMessage += "Microphone is already in use by another application.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage += "Microphone doesn't meet the required constraints.";
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Please check your browser permissions and try again.";
      }

      setError(errorMessage);
      setState("idle");
    }
  };

  const startDemo = async () => {
    await startRecording(false);
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
      setState("processing");
    }
  };

  const retryRecording = async () => {
    // For exercises, allow infinite retries (don't check retriesRemaining)
    if (exerciseList.length === 0 && retriesRemaining <= 0) return;

    // Clean up previous recording
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioBlob(null);
    setRecordingTime(0);
    setExerciseFeedback("");

    // Decrement retries only for regular sentences (not exercises)
    if (exerciseList.length === 0) {
      setRetriesRemaining(retriesRemaining - 1);
    }

    // Start recording again (retry mode)
    await startRecording(true);
  };

  const nextSentence = async () => {
    // Clean up previous recording
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioBlob(null);
    setRecordingTime(0);

    // Move to next sentence
    const nextIndex = currentSentenceIndex + 1;

    if (nextIndex >= sentenceList.length) {
      // All sentences completed - start analyzing
      setState("analyzing");
    } else {
      setCurrentSentenceIndex(nextIndex);
      setRetriesRemaining(2); // Reset retries for new sentence
      // Automatically start recording the next sentence
      await startRecording(true);
    }
  };

  const resetDemo = () => {
    setState("idle");
    setSentenceList([]);
    setCurrentSentenceIndex(0);
    setExerciseList([]);
    setCurrentExerciseIndex(0);
    setRetriesRemaining(2);
    setSentence("");
    setRecordingTime(0);
    setAudioBlob(null);
    setDiagnosis("");
    setExerciseFeedback("");
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setError(null);
  };

  const startExercises = () => {
    // Generate random exercises
    const exercises = getRandomExercises(5); // 5 exercises
    setExerciseList(exercises);
    setCurrentExerciseIndex(0);
    setState("exercises");
  };

  const startExerciseRecording = async () => {
    await startRecording(true);
  };

  const nextExercise = async () => {
    // Clean up previous recording
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioBlob(null);
    setRecordingTime(0);
    setExerciseFeedback("");

    const nextIndex = currentExerciseIndex + 1;

    if (nextIndex >= exerciseList.length) {
      // All exercises completed - show completion message
      setState("finished");
    } else {
      setCurrentExerciseIndex(nextIndex);
      setRetriesRemaining(2);
      // Go back to exercises state to show the next exercise
      setState("exercises");
    }
  };

  const moveToExercises = () => {
    // This is called from diagnosis screen - navigate to exercises
    startExercises();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <NavBar />
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="pt-24">
        <div className="text-center py-12 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            Try VocoLabAI Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our AI-powered pronunciation training platform
          </p>
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-8 shadow-lg">
            {state === "idle" && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/30 blur-2xl rounded-full" />
                  <PlayCircle className="w-16 h-16 relative z-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Ready to Start?</h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Click the button below to begin. You'll be asked to pronounce
                  a randomly generated sentence.
                </p>
                <Button onClick={startDemo} size="lg" className="gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Start Demo
                </Button>
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md w-full">
                    <p className="text-destructive font-semibold mb-2">
                      Permission Denied
                    </p>
                    <p className="text-destructive text-sm text-left">
                      {error}
                    </p>
                    <div className="mt-3 pt-3 border-t border-destructive/20">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">
                        Troubleshooting:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>
                          Check your browser's address bar for a microphone icon
                        </li>
                        <li>Click the icon and allow microphone access</li>
                        <li>Make sure you're using HTTPS or localhost</li>
                        <li>Check if another app is using your microphone</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {state === "recording" && (
              <div className="flex flex-col items-center justify-center space-y-6">
                {exerciseList.length > 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Exercise {currentExerciseIndex + 1} of {exerciseList.length}
                  </div>
                ) : (
                  sentenceList.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Sentence {currentSentenceIndex + 1} of{" "}
                      {sentenceList.length}
                    </div>
                  )
                )}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-red-500/30 blur-2xl rounded-full animate-pulse" />
                  <Mic className="w-16 h-16 relative z-10 text-red-500 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">Recording...</h2>
                  <p className="text-lg font-mono text-muted-foreground">
                    {formatTime(recordingTime)}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-6 w-full max-w-2xl">
                  {exerciseList.length > 0 &&
                    exerciseList[currentExerciseIndex] && (
                      <div className="mb-4 bg-primary/10 border border-primary/20 rounded-lg p-3">
                        <p className="text-sm font-semibold text-primary text-center">
                          {exerciseList[currentExerciseIndex].instruction}
                        </p>
                      </div>
                    )}
                  <p className="text-xl font-semibold text-center mb-2">
                    {exerciseList.length > 0
                      ? "Read this sentence:"
                      : "Pronounce this sentence:"}
                  </p>
                  <p className="text-2xl font-bold text-center text-primary">
                    "{sentence}"
                  </p>
                </div>
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                >
                  <Square className="w-5 h-5" />
                  Stop Recording
                </Button>
              </div>
            )}

            {state === "processing" && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <h2 className="text-2xl font-semibold">Processing...</h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Your recording is being processed. This may take a moment.
                </p>
              </div>
            )}

            {state === "completed" && (
              <div className="flex flex-col items-center justify-center space-y-6">
                {exerciseList.length > 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Exercise {currentExerciseIndex + 1} of {exerciseList.length}
                  </div>
                ) : (
                  sentenceList.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Sentence {currentSentenceIndex + 1} of{" "}
                      {sentenceList.length}
                    </div>
                  )
                )}

                {exerciseList.length > 0 ? (
                  // Exercise feedback UI
                  <>
                    <div className="relative">
                      {exerciseFeedback.toLowerCase().includes("perfect") ||
                      exerciseFeedback.toLowerCase().includes("excellent") ||
                      exerciseFeedback.toLowerCase().includes("wonderful") ||
                      exerciseFeedback.toLowerCase().includes("spot on") ? (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-green-500/30 blur-2xl rounded-full" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 blur-2xl rounded-full" />
                      )}
                      <div
                        className={`w-16 h-16 relative z-10 rounded-full flex items-center justify-center ${
                          exerciseFeedback.toLowerCase().includes("perfect") ||
                          exerciseFeedback
                            .toLowerCase()
                            .includes("excellent") ||
                          exerciseFeedback
                            .toLowerCase()
                            .includes("wonderful") ||
                          exerciseFeedback.toLowerCase().includes("spot on")
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {exerciseFeedback.toLowerCase().includes("perfect") ||
                        exerciseFeedback.toLowerCase().includes("excellent") ||
                        exerciseFeedback.toLowerCase().includes("wonderful") ||
                        exerciseFeedback.toLowerCase().includes("spot on") ? (
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-semibold">Feedback</h2>
                      <div className="bg-muted rounded-lg p-6 max-w-2xl">
                        <p className="text-xl font-semibold text-foreground">
                          {exerciseFeedback}
                        </p>
                      </div>
                    </div>
                    {audioUrl && (
                      <div className="w-full max-w-md space-y-4">
                        <audio
                          ref={audioRef}
                          src={audioUrl}
                          controls
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground text-center">
                          Duration: {formatTime(recordingTime)}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <Button
                        onClick={retryRecording}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Retry
                      </Button>
                      <Button
                        onClick={nextExercise}
                        size="lg"
                        className="gap-2"
                      >
                        Move on to next exercise
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  // Regular sentence completion UI
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-green-500/30 blur-2xl rounded-full" />
                      <div className="w-16 h-16 relative z-10 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-semibold">
                        Recording Complete!
                      </h2>
                      <p className="text-muted-foreground">
                        You recorded: "{sentence}"
                      </p>
                    </div>
                    {audioUrl && (
                      <div className="w-full max-w-md space-y-4">
                        <audio
                          ref={audioRef}
                          src={audioUrl}
                          controls
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground text-center">
                          Duration: {formatTime(recordingTime)}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <Button
                        onClick={retryRecording}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                        disabled={retriesRemaining <= 0}
                      >
                        <RotateCcw className="w-5 h-5" />
                        Retry? ({retriesRemaining}{" "}
                        {retriesRemaining === 1 ? "try" : "tries"} left)
                      </Button>
                      <Button
                        onClick={nextSentence}
                        size="lg"
                        className="gap-2"
                      >
                        Move on to next sentence
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {state === "exercises" && exerciseList.length > 0 && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="text-sm text-muted-foreground">
                  Exercise {currentExerciseIndex + 1} of {exerciseList.length}
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-2xl">
                  <div className="bg-muted rounded-lg p-6 w-full">
                    <p className="text-xl font-semibold text-center mb-4">
                      {exerciseList[currentExerciseIndex]?.sentence}
                    </p>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <p className="text-lg font-semibold text-primary text-center">
                        Instruction:{" "}
                        {exerciseList[currentExerciseIndex]?.instruction}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={startExerciseRecording}
                    size="lg"
                    className="gap-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Start Recording
                  </Button>
                </div>
              </div>
            )}

            {state === "analyzing" && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/30 blur-2xl rounded-full animate-pulse" />
                  <Brain className="w-16 h-16 relative z-10 text-primary animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">
                    Analyzing Your Speech
                  </h2>
                  <p className="text-muted-foreground">
                    Our AI backend is processing your recordings and calculating
                    your pronunciation patterns...
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>Processing audio data</span>
                </div>
              </div>
            )}

            {state === "diagnosis" && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/30 blur-2xl rounded-full" />
                  <div className="w-16 h-16 relative z-10 bg-primary rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">Diagnosis Complete</h2>
                  <div className="bg-muted rounded-lg p-6 max-w-2xl mt-4">
                    <p className="text-lg font-semibold text-primary mb-2">
                      Analysis Result:
                    </p>
                    <p className="text-xl text-foreground">{diagnosis}</p>
                  </div>
                  <p className="text-muted-foreground text-sm mt-4">
                    Based on your {sentenceList.length} recordings, our AI has
                    identified areas for improvement.
                  </p>
                </div>
                <Button onClick={moveToExercises} size="lg" className="gap-2">
                  Move on to exercises?
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            )}

            {state === "finished" && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-green-500/30 blur-2xl rounded-full" />
                  <div className="w-16 h-16 relative z-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">Demo Complete!</h2>
                  <p className="text-muted-foreground text-lg">Good job!</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    You've completed all {sentenceList.length} sentences and{" "}
                    {exerciseList.length} exercises. Great work!
                  </p>
                </div>
                <Button onClick={resetDemo} size="lg" className="gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Start Over
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
