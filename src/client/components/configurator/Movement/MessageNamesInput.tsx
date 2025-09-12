import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styles from './Moment.module.css';

interface MessageNamesInputProps {
  setMessage: (message: string) => void;
  setNames: (names: { myName: string; loverName: string }) => void;
}

const MessageNamesInput: React.FC<MessageNamesInputProps> = ({ setMessage, setNames }) => {
  const [message, setLocalMessage] = useState('');
  const [names, setLocalNames] = useState({ myName: '', loverName: '' });

  return (
    <div>
      {/* Custom Message Input */}
      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>
          <FontAwesomeIcon icon={faHeart} className={styles.icon} /> 
        </label>
        <textarea
          id="message"
          placeholder="Message for my love"
          className={styles.textarea}
          value={message}
          onChange={(e) => {
            setLocalMessage(e.target.value);
            setMessage(e.target.value); // Pass up to parent
          }}
        />
      </div>

      {/* Names Input */}
      <div className={styles.formGroup}>
        <label htmlFor="myName" className={styles.label}>
          Your Name
        </label>
        <input
          id="myName"
          type="text"
          placeholder="Enter your name"
          className={styles.inputField}
          value={names.myName}
          onChange={(e) => {
            const updatedNames = { ...names, myName: e.target.value };
            setLocalNames(updatedNames);
            setNames(updatedNames); // Pass up to parent
          }}
        />

        <label htmlFor="loverName" className={styles.label}>
          Your Lover's Name
        </label>
        <input
          id="loverName"
          type="text"
          placeholder="Enter your lover's name"
          className={styles.inputField}
          value={names.loverName}
          onChange={(e) => {
            const updatedNames = { ...names, loverName: e.target.value };
            setLocalNames(updatedNames);
            setNames(updatedNames); // Pass up to parent
          }}
        />
      </div>
    </div>
  );
};

export default MessageNamesInput;
