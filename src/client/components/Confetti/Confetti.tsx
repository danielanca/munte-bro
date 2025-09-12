import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import styles from './Confetti.module.css';

export const fireConfetti = () => {
  const duration = 2000; // 2 seconds
  const end = Date.now() + duration;

  const colors = ['#000', '#ff0000', '#f3f3f3'];

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });

    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  // Start the confetti animation
  frame();
};

const Confetti: React.FC = () => {
  // Return an empty div since this component only triggers confetti
  return <div className={styles.confettiContainer}></div>;
};

export default Confetti;
