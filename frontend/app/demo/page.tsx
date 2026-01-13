"use client";

import { useState, useRef, useEffect } from "react";
import {
  PlayCircle,
  Mic,
  Square,
  RotateCcw,
  Loader2,
  ArrowRight,
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

type DemoState = "idle" | "recording" | "processing" | "completed" | "finished";

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

      // Use current sentence from list
      const sentencesToUse = sentenceList.length > 0 ? sentenceList : [];
      if (sentencesToUse.length === 0) {
        setError("No sentences available. Please refresh the page.");
        setState("idle");
        return;
      }
      const currentSentence = sentencesToUse[currentSentenceIndex];
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
    if (retriesRemaining <= 0) return;

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

    // Decrement retries
    setRetriesRemaining(retriesRemaining - 1);

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
      // All sentences completed
      setState("finished");
    } else {
      setCurrentSentenceIndex(nextIndex);
      setRetriesRemaining(2); // Reset retries for new sentence
      setState("idle");
    }
  };

  const resetDemo = () => {
    setState("idle");
    setSentenceList([]);
    setCurrentSentenceIndex(0);
    setRetriesRemaining(2);
    setSentence("");
    setRecordingTime(0);
    setAudioBlob(null);
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <NavBar />
      <div className="pt-24">
        <div className="text-center py-12 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Try VocoLabAI Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our AI-powered pronunciation training platform
          </p>
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
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
                {sentenceList.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Sentence {currentSentenceIndex + 1} of {sentenceList.length}
                  </div>
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
                  <p className="text-xl font-semibold text-center mb-2">
                    Pronounce this sentence:
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
                {sentenceList.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Sentence {currentSentenceIndex + 1} of {sentenceList.length}
                  </div>
                )}
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
                  <Button onClick={nextSentence} size="lg" className="gap-2">
                    Move on to next sentence
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {state === "finished" && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/30 blur-2xl rounded-full" />
                  <div className="w-16 h-16 relative z-10 bg-primary rounded-full flex items-center justify-center">
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
                  <p className="text-muted-foreground">
                    You've completed all {sentenceList.length} sentences. Great
                    job!
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
