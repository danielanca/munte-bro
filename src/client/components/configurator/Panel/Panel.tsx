import React, { useState, useEffect } from 'react';
import styles from './Panel.module.css';
import MoonStyles from '../Design/MoonStyles';
import BackgroundStyles from '../Design/BackgroundStyles';
import DropdownSection from './DropdownSection';
import Moment from '../Movement/Moment';
import MobileNav from './MobileNav';

interface PanelProps {
  selectedMoonStyle: string;
  setSelectedMoonStyle: (style: string) => void;
  selectedBackgroundStyle: string;
  setSelectedBackgroundStyle: (style: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  selectedOrientation: string;
  setSelectedOrientation: (orientation: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  reloadTrigger: number;
  setReloadTrigger: (trigger: number) => void;
  selectedFrameStyle: string;
  setSelectedFrameStyle: (style: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedTextColor: string;
  setSelectedTextColor: (color: string) => void;
  setLocationName: (locationName: string) => void;
  setTime: (time: { hours: string; minutes: string; period: string }) => void;
  setMessage: (message: string) => void;
  setNames: (names: { myName: string; loverName: string }) => void;
  selectedGlow: boolean; // Added selectedGlow
  setSelectedGlow: (glow: boolean) => void; // Added setSelectedGlow
}

const Panel: React.FC<PanelProps> = ({
  selectedMoonStyle,
  setSelectedMoonStyle,
  selectedBackgroundStyle,
  setSelectedBackgroundStyle,
  backgroundColor,
  setBackgroundColor,
  selectedOrientation,
  setSelectedOrientation,
  selectedDate,
  setSelectedDate,
  reloadTrigger,
  setReloadTrigger,
  selectedFrameStyle,
  setSelectedFrameStyle,
  selectedTextColor,
  setSelectedTextColor,
  selectedFont,
  setSelectedFont,
  setLocationName,
  setTime,
  setMessage,
  setNames,
  selectedGlow,          // Added selectedGlow
  setSelectedGlow         // Added setSelectedGlow
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSaveClick = () => {
    setReloadTrigger(reloadTrigger + 1);
  };

  return (
    <div className={styles.panel}>
      {isMobile ? (
        <MobileNav
          selectedMoonStyle={selectedMoonStyle}
          setSelectedMoonStyle={setSelectedMoonStyle}
          selectedBackgroundStyle={selectedBackgroundStyle}
          setSelectedBackgroundStyle={setSelectedBackgroundStyle}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          selectedOrientation={selectedOrientation}
          setSelectedOrientation={setSelectedOrientation}
          selectedFrameStyle={selectedFrameStyle}
          setSelectedFrameStyle={setSelectedFrameStyle}
          setDate={setSelectedDate}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          selectedTextColor={selectedTextColor}
          setSelectedTextColor={setSelectedTextColor}
          setLocationName={setLocationName}
          setTime={setTime}
          setMessage={setMessage}
          setNames={setNames}
          selectedGlow={selectedGlow}          // Pass selectedGlow
          setSelectedGlow={setSelectedGlow}    // Pass setSelectedGlow
        />
      ) : (
        <div className={styles.contentContainer}>
          <DropdownSection title="Moon Styles">
            <MoonStyles
              selectedMoonStyle={selectedMoonStyle}
              setSelectedMoonStyle={setSelectedMoonStyle}
              selectedOrientation={selectedOrientation}
              setSelectedOrientation={setSelectedOrientation}
              selectedGlow={selectedGlow}       // Pass selectedGlow
              setSelectedGlow={setSelectedGlow} // Pass setSelectedGlow
            />
          </DropdownSection>

          <DropdownSection title="Movement">
            <Moment
              setDate={setSelectedDate}
              setLocationName={setLocationName}
              setTime={setTime}
              setMessage={setMessage}
              setNames={setNames}
            />
          </DropdownSection>

          <DropdownSection title="Background Styles">
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
          </DropdownSection>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button className={styles.saveButton} onClick={handleSaveClick}>
          Save
        </button>
        <button className={styles.selectLocationButton}>Select Location</button>
      </div>
    </div>
  );
};

export default Panel;
