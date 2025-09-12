import React from 'react';
import styles from './StarField.module.css'; // Import the CSS file

const StarField: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sky}>
        <div className={styles.stars}></div>
        <div className={styles.stars1}></div>
        <div className={styles.stars2}></div>
        <div className={styles.shootingStars}></div>
      </div>
    </div>
  );
};

export default StarField;
