import React, { useState } from 'react';
import styles from './TextSection.module.css';

const TextSection: React.FC = () => {
  const [isDateEnabled, setIsDateEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [isCoordinatesEnabled, setIsCoordinatesEnabled] = useState(false);

  return (
    <div className={styles.textSection}>
      {/* Title */}
      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label}>
            <i className="fas fa-font" /> Title
          </label>
        </div>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Choose a title"
          defaultValue="Sky Map"
        />
        <span className={styles.suggestion}>Choose a title for your map.</span>
      </div>

      {/* Message */}
      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label}>
            <i className="fas fa-pencil-alt" /> Your Message
          </label>
        </div>
        <textarea
          className={styles.textArea}
          rows={2}
          defaultValue="You are made of stardust and wishes and magical things"
        />
        <span className={styles.suggestion}>Suggestions for your message.</span>
      </div>

      {/* Date */}
      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label}>
            <i className="fas fa-calendar-alt" /> Date
          </label>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isDateEnabled}
              onChange={() => setIsDateEnabled(!isDateEnabled)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <input
          type="text"
          className={styles.inputField}
          value="20th September 2021"
          disabled={!isDateEnabled}
        />
        <span className={styles.suggestion}>Customize the date text here.</span>
      </div>

      {/* Location */}
      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label}>
            <i className="fas fa-map-marker-alt" /> Location
          </label>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isLocationEnabled}
              onChange={() => setIsLocationEnabled(!isLocationEnabled)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <input
          type="text"
          className={styles.inputField}
          value="New York City, NY, USA"
          disabled={!isLocationEnabled}
        />
        <span className={styles.suggestion}>Customize the location text here.</span>
      </div>

      {/* Coordinates */}
      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label}>
            <i className="fas fa-compass" /> Coordinates
          </label>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isCoordinatesEnabled}
              onChange={() => setIsCoordinatesEnabled(!isCoordinatesEnabled)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <input
          type="text"
          className={styles.inputField}
          value="40.7306° N, 73.9866° W"
          disabled={!isCoordinatesEnabled}
        />
        <span className={styles.suggestion}>Customize the coordinates text here.</span>
      </div>
    </div>
  );
};

export default TextSection;
