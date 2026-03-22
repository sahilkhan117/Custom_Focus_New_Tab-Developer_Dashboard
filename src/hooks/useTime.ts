import { useState, useEffect } from 'react';

/**
 * Hook for a real-time digital clock formatted as HH:MM:SS
 */
export function useTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return {
    hours: String(time.getHours()).padStart(2, '0'),
    minutes: String(time.getMinutes()).padStart(2, '0'),
    seconds: String(time.getSeconds()).padStart(2, '0'),
    raw: time,
  };
}

/**
 * Hook for calculating countdown to a target time (e.g. End of Day)
 */
export function useCountdown(targetHour: number = 18) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isCritical, setIsCritical] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const target = new Date(now);
      target.setHours(targetHour, 0, 0, 0);

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        setIsCritical(true);
        setProgress(100);
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      // Progress based on the full day (elapsed)
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);
      const totalDuration = target.getTime() - startOfToday.getTime();
      const elapsed = now.getTime() - startOfToday.getTime();
      
      const safeDuration = Math.max(1, totalDuration);
      setProgress(Math.min(100, Math.max(0, (elapsed / safeDuration) * 100)));

      setIsCritical(diff < 3600000); // Critical if < 1 hour left
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetHour]);

  return { timeLeft, isCritical, progress };
}
