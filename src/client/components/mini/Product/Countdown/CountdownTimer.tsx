import React, { useState, useEffect } from "react";
interface timerType {
  hours: number;
  minutes: number;
  seconds: number;
  className: string;
}
const CountdownTimer = ({ hours, minutes, seconds, className } : timerType) => {
  const [remainingTime, setRemainingTime] = useState(hours * 3600 + minutes * 60 + seconds);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Start the countdown
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    // Clean up the interval when the countdown is finished
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [remainingTime]);

  // Format the remaining time into minutes and seconds
  // Format the remaining time into hours, minutes, and seconds
  const formattedHours = Math.floor(remainingTime / 3600)
    .toString()
    .padStart(2, "0");
  const formattedMinutes = Math.floor((remainingTime % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const formattedSeconds = (remainingTime % 60).toString().padStart(2, "0");

  return <div className={className}>{`Au rămas ${formattedHours}h:${formattedMinutes}m:${formattedSeconds}s `}</div>;
};

export default CountdownTimer;
