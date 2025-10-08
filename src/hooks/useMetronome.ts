import { useRef, useEffect, useCallback } from "react";

interface UseMetronomeOptions {
  bpm: number;
  beatsPerMeasure: number;
  isPlaying: boolean;
  onBeatChange?: (beat: number) => void;
}

export const useMetronome = ({
  bpm,
  beatsPerMeasure,
  isPlaying,
  onBeatChange,
}: UseMetronomeOptions) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextBeatTimeRef = useRef<number>(0);
  const timerIdRef = useRef<number | null>(null);
  const currentBeatRef = useRef<number>(0);

  // Initialize audio context
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    } catch (error) {
      console.error("Failed to create audio context:", error);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play click sound
  const playClick = useCallback((isAccent: boolean = false) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Accent (first beat) is higher pitch
    oscillator.frequency.value = isAccent ? 1200 : 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }, []);

  // Schedule the next beat
  const scheduleNote = useCallback(() => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const secondsPerBeat = 60.0 / bpm;

    // Schedule ahead by a small amount for precision
    const scheduleAheadTime = 0.1;

    while (nextBeatTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      // Determine if this is an accent beat (first beat of measure)
      const isAccent = currentBeatRef.current === 0;

      // Schedule the click sound
      const beatTime = nextBeatTimeRef.current;
      const delay = (beatTime - ctx.currentTime) * 1000;

      if (delay >= 0) {
        setTimeout(() => {
          // Update visual to show the CURRENT beat that's playing
          if (onBeatChange) {
            onBeatChange(currentBeatRef.current);
          }
          // Play the click sound
          playClick(isAccent);
          // Then increment to next beat for next iteration
          currentBeatRef.current =
            (currentBeatRef.current + 1) % beatsPerMeasure;
        }, delay);
      }

      // Advance to next beat
      nextBeatTimeRef.current += secondsPerBeat;
    }
  }, [bpm, beatsPerMeasure, playClick, onBeatChange]);

  // Main metronome loop
  useEffect(() => {
    if (isPlaying) {
      if (audioContextRef.current) {
        nextBeatTimeRef.current = audioContextRef.current.currentTime;
      }

      const timer = setInterval(() => {
        scheduleNote();
      }, 25); // Check every 25ms

      timerIdRef.current = timer as unknown as number;

      return () => {
        clearInterval(timer);
      };
    } else {
      if (timerIdRef.current !== null) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
      currentBeatRef.current = 0;
      if (onBeatChange) {
        onBeatChange(0);
      }
    }
  }, [isPlaying, scheduleNote, onBeatChange]);

  // Reset beat counter when time signature changes
  useEffect(() => {
    if (!isPlaying) {
      currentBeatRef.current = 0;
      if (onBeatChange) {
        onBeatChange(0);
      }
    }
  }, [beatsPerMeasure, isPlaying, onBeatChange]);

  return {
    currentBeat: currentBeatRef.current,
  };
};
