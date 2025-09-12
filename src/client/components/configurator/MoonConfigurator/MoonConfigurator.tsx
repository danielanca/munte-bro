// MoonConfigurator.tsx

import React, { useState } from 'react';
import styles from './MoonConfigurator.module.css'; 
import Panel from '../Panel/Panel';
import Frame from '../Frame/Frame';

const MoonConfigurator: React.FC = () => {
  const [selectedMoonStyle, setSelectedMoonStyle] = useState<string>('default');
  const [selectedBackgroundStyle, setSelectedBackgroundStyle] = useState<string>('stars');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [selectedOrientation, setSelectedOrientation] = useState<string>('north-up');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [selectedFrameStyle, setSelectedFrameStyle] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<string>('Playwrite GB S');
  const [selectedTextColor, setSelectedTextColor] = useState<string>('#ffffff');
  const [locationName, setLocationName] = useState<string>('');
  const [time, setTime] = useState({ hours: '01', minutes: '00', period: 'AM' });
  const [message, setMessage] = useState<string>('Message for my love');
  const [names, setNames] = useState({ myName: 'Your Name', loverName: 'Lover\'s Name' });
  const [selectedGlow, setSelectedGlow] = useState<boolean>(false); // New state for glow

  return (
    <div className={styles.configuratorContainer}>
      <div className={styles.frameContainer}>
        <Frame 
          selectedMoonStyle={selectedMoonStyle} 
          selectedBackgroundStyle={selectedBackgroundStyle} 
          backgroundColor={backgroundColor}
          selectedOrientation={selectedOrientation}
          selectedDate={selectedDate}
          reloadTrigger={reloadTrigger}
          selectedFrameStyle={selectedFrameStyle}
          selectedFont={selectedFont} 
          selectedTextColor={selectedTextColor}
          locationName={locationName}
          time={time}
          message={message}
          names={names}
          selectedGlow={selectedGlow} // Pass glow state to Frame
        />
      </div>

      <div className={styles.panelContainer}>
        <Panel 
          selectedMoonStyle={selectedMoonStyle}
          setSelectedMoonStyle={setSelectedMoonStyle}
          selectedBackgroundStyle={selectedBackgroundStyle}
          setSelectedBackgroundStyle={setSelectedBackgroundStyle}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          selectedOrientation={selectedOrientation}
          setSelectedOrientation={setSelectedOrientation}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          reloadTrigger={reloadTrigger}
          setReloadTrigger={setReloadTrigger}
          selectedFrameStyle={selectedFrameStyle}
          setSelectedFrameStyle={setSelectedFrameStyle}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          selectedTextColor={selectedTextColor}
          setSelectedTextColor={setSelectedTextColor}
          setLocationName={setLocationName}
          setTime={setTime}
          setMessage={setMessage}
          setNames={setNames}
          selectedGlow={selectedGlow} // Pass selectedGlow state
          setSelectedGlow={setSelectedGlow} // Pass glow setter to Panel
        />
      </div>
    </div>
  );
};

export default MoonConfigurator;
