// MobileNav.tsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faImage, faCog } from '@fortawesome/free-solid-svg-icons';
import MoonStyles from '../Design/MoonStyles';
import BackgroundStyles from '../Design/BackgroundStyles';
import Movement from '../Movement/Moment';
import styles from './MobileNav.module.css';

interface MobileNavProps {
  selectedMoonStyle: string;
  setSelectedMoonStyle: (style: string) => void;
  selectedBackgroundStyle: string;
  setSelectedBackgroundStyle: (style: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  selectedOrientation: string;
  setSelectedOrientation: (orientation: string) => void;
  selectedFrameStyle: string;
  setSelectedFrameStyle: (style: string) => void;
  setDate: (date: Date) => void;
  setLocationName: (locationName: string) => void;
  setTime: (time: { hours: string; minutes: string; period: string }) => void;
  setMessage: (message: string) => void;
  setNames: (names: { myName: string; loverName: string }) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedTextColor: string;
  setSelectedTextColor: (color: string) => void;
  selectedGlow: boolean; // New selectedGlow prop
  setSelectedGlow: (glow: boolean) => void; // New setSelectedGlow prop
}

const MobileNav: React.FC<MobileNavProps> = ({
  selectedMoonStyle,
  setSelectedMoonStyle,
  selectedBackgroundStyle,
  setSelectedBackgroundStyle,
  backgroundColor,
  setBackgroundColor,
  selectedOrientation,
  setSelectedOrientation,
  selectedFrameStyle,
  setSelectedFrameStyle,
  setDate,
  setLocationName,
  setTime,
  setMessage,
  setNames,
  selectedFont,
  setSelectedFont,
  selectedTextColor,
  setSelectedTextColor,
  selectedGlow, // Add selectedGlow here
  setSelectedGlow, // Add setSelectedGlow here
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleNavClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className={styles.mobileNav}>
      <div className={styles.navContainer}>
        <button onClick={() => handleNavClick('MoonStyles')}>
          <FontAwesomeIcon icon={faMoon} className={styles.menuIcon} />
          <span>Moon Styles</span>
        </button>
        <button onClick={() => handleNavClick('BackgroundStyles')}>
          <FontAwesomeIcon icon={faImage} className={styles.menuIcon} />
          <span>Background Styles</span>
        </button>
        <button onClick={() => handleNavClick('Movement')}>
          <FontAwesomeIcon icon={faCog} className={styles.menuIcon} />
          <span>Movement</span>
        </button>
      </div>

      <div className={styles.contentContainer}>
        {activeSection === 'MoonStyles' && (
          <div className={styles.section}>
            <MoonStyles
              selectedMoonStyle={selectedMoonStyle}
              setSelectedMoonStyle={setSelectedMoonStyle}
              selectedOrientation={selectedOrientation}
              setSelectedOrientation={setSelectedOrientation}
              selectedGlow={selectedGlow} // Pass selectedGlow
              setSelectedGlow={setSelectedGlow} // Pass setSelectedGlow
            />
          </div>
        )}
        {activeSection === 'BackgroundStyles' && (
          <div className={styles.section}>
            <BackgroundStyles
              selectedBackgroundStyle={selectedBackgroundStyle}
              setSelectedBackgroundStyle={setSelectedBackgroundStyle}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              selectedFont={selectedFont}
              setSelectedFont={setSelectedFont}
              selectedTextColor={selectedTextColor}
              setSelectedTextColor={setSelectedTextColor}
            />
          </div>
        )}
        {activeSection === 'Movement' && (
          <div className={styles.section}>
            <Movement
              setDate={setDate}
              setLocationName={setLocationName}
              setTime={setTime}
              setMessage={setMessage}
              setNames={setNames}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
