import React, { useState } from 'react';
import styles from './MoonStyles.module.css';
import moonDefault from '../images/moonDefault.avif';
import moonShaded from '../images/moonShaded.png';
import moonSketch from '../images/moonSketch.avif';
import northUp from '../images/north-up.png';
import southUp from '../images/southe-up.png';

interface MoonStylesProps {
  selectedMoonStyle: string;
  setSelectedMoonStyle: (style: string) => void;
  selectedOrientation: string;
  setSelectedOrientation: (orientation: string) => void;
  selectedGlow: boolean;
  setSelectedGlow: (glow: boolean) => void;
}

const MoonStyles: React.FC<MoonStylesProps> = ({
  selectedMoonStyle,
  setSelectedMoonStyle,
  selectedOrientation,
  setSelectedOrientation,
  selectedGlow,
  setSelectedGlow
}) => {
  const moonStyles = [
    { id: 'default', label: 'Default', icon: moonDefault },
    { id: 'shaded', label: 'Shaded', icon: moonShaded },
    { id: 'sketch', label: 'Sketch', icon: moonSketch },
  ];

  const moonglow = [
    { id: 'advance-space-scene', label: 'AS-scene', icon: northUp },
    { id: 'south-up', label: 'South-Up', icon: southUp },
  ];

  return (
    <div className={styles.moonStylesContainer}>
      <h3 className={styles.sectionTitle}>Moon Styles</h3>
      <div className={styles.grid}>
        {moonStyles.map((style) => (
          <div key={style.id} className={styles.moonStyle}>
            <div
              className={`${styles.iconContainer} ${
                selectedMoonStyle === style.id ? styles.selected : ''
              }`}
              onClick={() => setSelectedMoonStyle(style.id)}
            >
              <img src={style.icon} alt={style.label} className={styles.moonStyleIcon} />
            </div>
            <span className={styles.subLabel}>{style.label}</span>
          </div>
        ))}
      </div>

      <hr className={styles.divider} />

      <h3 className={styles.sectionTitle}>Moon Glow</h3>
      <div className={styles.grid}>
        {moonglow.map((glow) => (
          <div key={glow.id} className={styles.moonGlowStyle}>
            <div
              className={`${styles.iconContainer} ${
                selectedOrientation === glow.id ? styles.selected : ''
              }`}
              onClick={() => {
                setSelectedOrientation(glow.id);
                setSelectedGlow(glow.id === 'advance-space-scene'); // Toggle glow for AS-scene
              }}
            >
              <img src={glow.icon} alt={glow.label} className={styles.orientationIcon} />
            </div>
            <span
              className={`${styles.subLabel} ${glow.id === 'south-up' ? styles.neonText : ''}`} // Apply neonText only for South-Up
            >
              {glow.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoonStyles;
