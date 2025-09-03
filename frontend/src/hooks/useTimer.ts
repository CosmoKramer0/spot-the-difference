import { useState, useEffect, useRef } from 'react';

interface UseTimerReturn {
  time: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  getFormattedTime: () => string;
}

export const useTimer = (initialTime: number = 0): UseTimerReturn => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time * 10; // Account for any existing time
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current!) / 10);
        setTime(elapsed);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setTime(initialTime);
    setIsRunning(false);
    startTimeRef.current = null;
  };

  const getFormattedTime = () => {
    const totalSeconds = Math.floor(time / 100);
    const milliseconds = time % 100;
    return `${totalSeconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  return {
    time,
    isRunning,
    start,
    stop,
    reset,
    getFormattedTime,
  };
};