import React from "react";
import styles from "../Design/WallFrame/WallFrame.module.css";
import MoonScene from "../Design/MoonScene/MoonScene";
import NightSky from "../Design/NightSky/NightSky";
import StarField from "../Design/StarField/StarField";
import useMoonData from "../hooks/useMoonData";
import ThreeJSBackground from "../Design/DefaultBackground/DefaultBackground";

interface FrameProps {
  selectedMoonStyle: string;
  selectedBackgroundStyle?: string;
  backgroundColor: string;
  selectedOrientation: string;
  selectedDate: Date;
  reloadTrigger: number;
  selectedFrameStyle: string;
  selectedFont: string;
  selectedTextColor: string;
  locationName: string; // Use location name instead of latitude/longitude
  time: { hours: string; minutes: string; period: string };
  message: string; // Custom message input
  names: { myName: string; loverName: string }; // Names of both lovers
  selectedGlow: boolean; // Add selectedGlow prop
}

const Frame: React.FC<FrameProps> = ({
  selectedMoonStyle,
  selectedBackgroundStyle = 'threeJS',
  backgroundColor,
  selectedOrientation,
  selectedDate,
  reloadTrigger,
  selectedFrameStyle,
  selectedFont,
  selectedTextColor,
  locationName, // Use locationName instead of latitude/longitude
  time, // Receive time
  message, // Message for the lover
  names, // Lover's names
  selectedGlow, // Receive selectedGlow
}) => {
  const { moonPhase, moonEmoji, moonIllumination } = useMoonData(selectedDate, reloadTrigger);

  const renderBackground = () => {
    if (selectedBackgroundStyle === 'nightSky') {
      return <NightSky />;
    }
    if (selectedBackgroundStyle === 'starfield') {
      return <StarField />;
    }
    if (selectedBackgroundStyle === 'solid') {
      return (
        <div
          style={{ backgroundColor: backgroundColor, width: '100%', height: '100%', position: 'absolute', zIndex: -1 }}
        />
      );
    }
    if (selectedBackgroundStyle === 'threeJS') {
      return <ThreeJSBackground />;
    }
    return (
      <div
        style={{
          backgroundImage: `url(${selectedBackgroundStyle})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: -1,
        }}
      />
    );
  };

  return (
    <div id="wall" className={styles.wall}>
      <div id="frame" className={styles.frame}>
        {renderBackground()}
        
        {/* Pass locationName, date, and time to MoonScene */}
        <div className={styles.moonSceneContainer}>
          <MoonScene
            latitude="0" // Placeholder as this prop is unused
            longitude="0" // Placeholder as this prop is unused
            date={selectedDate}
            time={time}
            selectedGlow={selectedGlow} // Pass selectedGlow to MoonScene
            selectedOrientation={selectedOrientation} // Pass selectedOrientation to MoonScene
          />
        </div>

        <div
          id="text"
          className={styles.text}
          style={{ fontFamily: selectedFont, color: selectedTextColor }} // Apply selected font and text color
        >
          <p>{message}</p> {/* Custom message */}
          <p>{names.myName} & {names.loverName}</p> {/* Display the names */}
          
          {/* Display Date, Time, and Location on the same line with smaller font */}
          <p className={styles.dateTimeLocation}>
            {selectedDate.toLocaleDateString()} - {time.hours}:{time.minutes} {time.period} - {locationName}
          </p>

          <p>{moonEmoji}</p> {/* Display moon emoji */}
        </div>
      </div>
    </div>
  );
};

export default Frame;
