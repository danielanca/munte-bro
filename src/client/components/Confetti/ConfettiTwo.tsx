import React from 'react';
import confetti from 'canvas-confetti';
import styles from './ConfettiTwo.module.css';

export const fireConfettiTwo = (x: number, y: number) => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: x, y: y },
  });
};

const ConfettiTwo: React.FC = () => {
  return <div className={styles.confettiTwoContainer}></div>;
};

export default ConfettiTwo;
