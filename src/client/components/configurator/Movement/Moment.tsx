import React from 'react';
import DateLocationTimePicker from './DateLocationTimePicker';
import MessageNamesInput from './MessageNamesInput';
import styles from './Moment.module.css';

interface MovementProps {
  setDate: (date: Date) => void;
  setLocationName: (locationName: string) => void; // Add setLocationName prop
  setTime: (time: { hours: string; minutes: string; period: string }) => void;
  setMessage: (message: string) => void;
  setNames: (names: { myName: string; loverName: string }) => void;
}

const Moment: React.FC<MovementProps> = ({
  setDate,
  setLocationName, // Add setLocationName
  setTime,
  setMessage,
  setNames,
}) => {
  return (
    <div className={styles.movementContainer}>
      <DateLocationTimePicker 
        setDate={setDate}
        setLocationName={setLocationName} 
        setTime={setTime}
      />
      <MessageNamesInput 
        setMessage={setMessage}
        setNames={setNames}
      />
    </div>
  );
};

export default Moment;
