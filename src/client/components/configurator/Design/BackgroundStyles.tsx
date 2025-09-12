import React from 'react';
import styles from './BackgroundStyles.module.css';
import starsBackground from '../images/icons8-stars-96.png';
import solidBackground from '../images/icons8-solid-64.png';
import nightSkyIcon from '../images/icons8-solid-64.png'; // Icon for the night sky background
import threeJSIcon from '../images/icons8-solid-64.png'; // Icon for the ThreeJS background

interface BackgroundStylesProps {
  selectedBackgroundStyle: string;
  setSelectedBackgroundStyle: (style: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedTextColor: string;
  setSelectedTextColor: (color: string) => void;
}

const BackgroundStyles: React.FC<BackgroundStylesProps> = ({
  selectedBackgroundStyle,
  setSelectedBackgroundStyle,
  backgroundColor,
  setBackgroundColor,
  selectedFont,
  setSelectedFont,
  selectedTextColor,
  setSelectedTextColor,
}) => {
  const backgroundOptions = [
    { id: 'starfield', label: 'Stars Field', icon: starsBackground },
    { id: 'nightSky', label: 'Night Sky', icon: nightSkyIcon },
    { id: 'threeJS', label: 'Sky Move', icon: threeJSIcon }, 
    { id: 'solid', label: 'Solid', icon: solidBackground },

  ];

  const fontOptions = ['Playwrite GB S','Roboto', 'Lato', 'Montserrat',  'Space Grotesk','Kablammo'];

  return (
    <div className={styles.backgroundStylesContainer}>
      <h3 className={styles.sectionTitle}>Background Styles</h3>
      <div className={styles.grid}>
        {backgroundOptions.map((option) => (
          <div key={option.id} className={styles.backgroundStyle}>
            <div
              className={`${styles.iconContainer} ${
                selectedBackgroundStyle === option.id ? styles.selected : ''
              }`}
              onClick={() => setSelectedBackgroundStyle(option.id)}
            >
              <img src={option.icon} alt={option.label} className={styles.backgroundStyleIcon} />
            </div>
            <span className={styles.subLabel}>{option.label}</span>
          </div>
        ))}
      </div>

      {selectedBackgroundStyle === 'solid' && (
        <div className={styles.colorPicker}>
          <label htmlFor="backgroundColor">Select Background Color:</label>
          <input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>
      )}

      {/* Text Customization Section */}
      <hr className={styles.underline} />
      <h3 className={styles.sectionTitle}>Text Customization</h3>

      <div className={styles.fontPicker}>
        <label htmlFor="fontPicker">Select Font:</label>
        <select
          id="fontPicker"
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
        >
          {fontOptions.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.colorPicker}>
        <label htmlFor="textColor">Select Text Color:</label>
        <input
          type="color"
          id="textColor"
          value={selectedTextColor}
          onChange={(e) => setSelectedTextColor(e.target.value)}
        />
      </div>
    </div>
  );
};

export default BackgroundStyles;
