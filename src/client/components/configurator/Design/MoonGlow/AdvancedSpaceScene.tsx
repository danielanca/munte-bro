import React from 'react';
import styles from './AdvancedSpaceScene.module.css';

const AdvancedSpaceScene: React.FC = () => {
  return (
    <div>
      <canvas id="starfield" className={styles.starfield}></canvas>

      {/* Floating stars */}
      <div className={`${styles.floatingStar} ${styles.floatingStar1}`}></div>
      <div className={`${styles.floatingStar} ${styles.floatingStar2}`}></div>
      <div className={`${styles.floatingStar} ${styles.floatingStar3}`}></div>

      {/* Shooting stars */}
      <div className={`${styles.shootingStar} ${styles.shootingStar1}`}></div>
      <div className={`${styles.shootingStar} ${styles.shootingStar2}`}></div>
      <div className={`${styles.shootingStar} ${styles.shootingStar3}`}></div>
    </div>
  );
};

export default AdvancedSpaceScene;
