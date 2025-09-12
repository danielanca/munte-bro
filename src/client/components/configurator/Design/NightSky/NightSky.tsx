import React from 'react';
import styles from './NightSky.module.css'; // Import the CSS file

const NightSky: React.FC = () => {
  return (
    <div>
      <div className={styles.stars}></div>
      <div className={styles.twinkling}></div>
      <div className={styles.clouds}></div>
    </div>
  );
};

export default NightSky;
