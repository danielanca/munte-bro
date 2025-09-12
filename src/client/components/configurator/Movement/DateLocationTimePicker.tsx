import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Autocomplete, LoadScript, Libraries } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import styles from './Moment.module.css';
import config from '../Frame/configurations';

interface DateLocationTimePickerProps {
  setDate: (date: Date) => void;
  setLocationName: (locationName: string) => void; // Add setLocationName prop
  setTime: (time: { hours: string; minutes: string; period: string }) => void;
}

const libraries: Libraries = ['places']; // Required for Autocomplete to work

const DateLocationTimePicker: React.FC<DateLocationTimePickerProps> = ({
  setDate,
  setLocationName, // Add setLocationName
  setTime
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setLocalTime] = useState({ hours: '01', minutes: '00', period: 'AM' });
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedTime = { ...time, [name]: value };
    setLocalTime(updatedTime);
    setTime(updatedTime);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) setDate(date);
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const locationName = place.formatted_address || place.name || 'Unknown Location'; // Extract location name
      setLocationName(locationName); // Pass location name
    }
  };

  return (
    <LoadScript googleMapsApiKey={config.geolocationApi || ''} libraries={libraries}>
      <div className={styles.movementContainer}>
        {/* Location Input with Google Maps Autocomplete */}
        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>
              <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} /> Location
            </label>
          </div>
          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={handlePlaceChanged}
            options={{ componentRestrictions: { country: 'RO' } }}
          >
            <input type="text" placeholder="Enter your location" className={styles.inputField} />
          </Autocomplete>
        </div>

        {/* Date Picker */}
        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>
              <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} /> Date
            </label>
          </div>
          <DatePicker selected={selectedDate} onChange={handleDateChange} className={styles.datePicker} />
        </div>

        {/* Time Picker */}
        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>
              <FontAwesomeIcon icon={faClock} className={styles.icon} /> Time
            </label>
          </div>
          <div className={styles.timePicker}>
            <input
              type="text"
              name="hours"
              value={time.hours}
              onChange={handleTimeChange}
              className={styles.timeField}
            />
            :
            <input
              type="text"
              name="minutes"
              value={time.minutes}
              onChange={handleTimeChange}
              className={styles.timeField}
            />
            <select
              name="period"
              value={time.period}
              onChange={(e) => {
                const updatedTime = { ...time, period: e.target.value };
                setLocalTime(updatedTime);
                setTime(updatedTime);
              }}
              className={styles.selectField}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default DateLocationTimePicker;
