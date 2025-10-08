import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface TimerProps {
  initialDuration: number; // Duration in seconds
  onTimeComplete?: (practicedSeconds: number) => void; // Callback when timer completes or is stopped
  onReset?: () => void; // Optional callback when timer is reset
  onStart?: () => void; // Optional callback when timer starts
  onPause?: () => void; // Optional callback when timer is paused
  onResume?: () => void; // Optional callback when timer resumes
}

const Timer = ({
  initialDuration,
  onTimeComplete,
  onReset,
  onStart,
  onPause,
  onResume,
}: TimerProps) => {
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(initialDuration);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [pausedAt, setPausedAt] = useState<number>(0);

  // Update remaining seconds when initial duration changes (e.g., when exercise changes)
  useEffect(() => {
    if (!isTimerRunning) {
      setRemainingSeconds(initialDuration);
    }
  }, [initialDuration, isTimerRunning]);

  // Timer interval effect (countdown)
  useEffect(() => {
    let interval: number | null = null;

    if (isTimerRunning && !isPaused && timerStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - timerStartTime) / 1000);
        const remaining = Math.max(0, initialDuration - elapsed);

        setRemainingSeconds(remaining);

        // Play sound when timer reaches 0
        if (remaining === 0 && elapsed > 0) {
          setIsTimerRunning(false);
          setIsPaused(false);
          playTimerSound();

          // Notify parent component of completion
          if (onTimeComplete) {
            onTimeComplete(initialDuration);
          }

          toast.success("Time's up! 🎉", {
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#f3f4f6",
              border: "2px solid #10b981",
            },
          });
        }
      }, 100); // Update every 100ms for smooth display
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isTimerRunning,
    isPaused,
    timerStartTime,
    initialDuration,
    onTimeComplete,
  ]);

  // Play sound when timer completes
  const playTimerSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: AudioContext })
          .webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Error playing timer sound:", error);
    }
  };

  // Format timer display
  const formatTimerDisplay = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = () => {
    const elapsed = initialDuration - remainingSeconds;
    setTimerStartTime(Date.now() - elapsed * 1000);
    setIsTimerRunning(true);
    setIsPaused(false);
    if (onStart) {
      onStart();
    }
  };

  const handlePauseTimer = () => {
    setIsPaused(true);
    setPausedAt(remainingSeconds);
    if (onPause) {
      onPause();
    }
  };

  const handleResumeTimer = () => {
    const elapsed = initialDuration - pausedAt;
    setTimerStartTime(Date.now() - elapsed * 1000);
    setIsPaused(false);
    if (onResume) {
      onResume();
    }
  };

  const handleToggleTimer = () => {
    if (!isTimerRunning) {
      // Start the timer
      handleStartTimer();
    } else if (isPaused) {
      // Resume from pause
      handleResumeTimer();
    } else {
      // Pause the timer
      handlePauseTimer();
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setIsPaused(false);
    setRemainingSeconds(initialDuration);
    setTimerStartTime(null);
    setPausedAt(0);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
      <div className="text-center">
        <div className="text-5xl font-bold text-white mb-4 font-mono">
          {formatTimerDisplay(remainingSeconds)}
        </div>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={handleToggleTimer}
            disabled={initialDuration === 0}
            className={`${
              !isTimerRunning
                ? "bg-green-600 hover:bg-green-700"
                : isPaused
                ? "bg-green-600 hover:bg-green-700"
                : "bg-yellow-600 hover:bg-yellow-700"
            } disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-8 rounded-lg transition`}
          >
            {!isTimerRunning ? "Start" : isPaused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={handleResetTimer}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Reset
          </button>
        </div>
        {remainingSeconds < initialDuration &&
          isPaused &&
          initialDuration > 0 && (
            <p className="text-xs text-yellow-400 mt-3">
              Paused - {Math.ceil((initialDuration - remainingSeconds) / 60)}{" "}
              minutes practiced
            </p>
          )}
      </div>
    </div>
  );
};

export default Timer;
