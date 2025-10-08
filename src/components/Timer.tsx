import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface TimerProps {
  initialDuration: number; // Duration in seconds
  onTimeComplete?: (practicedSeconds: number) => void; // Callback when timer completes or is stopped
  onReset?: () => void; // Optional callback when timer is reset
}

const Timer = ({ initialDuration, onTimeComplete, onReset }: TimerProps) => {
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(initialDuration);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);

  // Update remaining seconds when initial duration changes (e.g., when exercise changes)
  useEffect(() => {
    if (!isTimerRunning) {
      setRemainingSeconds(initialDuration);
    }
  }, [initialDuration, isTimerRunning]);

  // Timer interval effect (countdown)
  useEffect(() => {
    let interval: number | null = null;

    if (isTimerRunning && timerStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - timerStartTime) / 1000);
        const remaining = Math.max(0, initialDuration - elapsed);

        setRemainingSeconds(remaining);

        // Play sound when timer reaches 0
        if (remaining === 0 && elapsed > 0) {
          setIsTimerRunning(false);
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
  }, [isTimerRunning, timerStartTime, initialDuration, onTimeComplete]);

  // Play sound when timer completes
  const playTimerSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: AudioContext }).webkitAudioContext)();
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
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    // Notify parent with actual practice time
    const practicedSeconds = initialDuration - remainingSeconds;
    if (onTimeComplete) {
      onTimeComplete(practicedSeconds);
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setRemainingSeconds(initialDuration);
    setTimerStartTime(null);
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
          {!isTimerRunning ? (
            <button
              type="button"
              onClick={handleStartTimer}
              disabled={initialDuration === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Start
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopTimer}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Stop
            </button>
          )}
          <button
            type="button"
            onClick={handleResetTimer}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Reset
          </button>
        </div>
        {remainingSeconds < initialDuration &&
          !isTimerRunning &&
          initialDuration > 0 && (
            <p className="text-xs text-green-400 mt-3">
              Timer stopped - practiced for{" "}
              {Math.ceil((initialDuration - remainingSeconds) / 60)} minutes
            </p>
          )}
      </div>
    </div>
  );
};

export default Timer;
