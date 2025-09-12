import React, { useCallback, useEffect, useState } from "react";
import styles from "./Checkboxer.module.scss";

interface InputProps {
  name?: string;
  onSwitchEnabled: (value: boolean, optionChoosed?: string) => void;
  enabled?: boolean;
}

const Checkboxer = ({ name, enabled, onSwitchEnabled }: InputProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(enabled !== undefined ? enabled : false);

  // Synchronize isChecked state with enabled prop changes
  useEffect(() => {
    if (enabled !== undefined && enabled !== isChecked) {
      setIsChecked(enabled);
    }
  }, [enabled, isChecked]);

  const onChangeState = useCallback(() => {
    const newState = !isChecked;
    setIsChecked(newState);
    if (typeof name === "string") {
      onSwitchEnabled(newState, name);
    } else {
      onSwitchEnabled(newState);
    }
  }, [isChecked, name, onSwitchEnabled]);

  return (
    <label className={styles.labelRow}>
      <input
        type='checkbox'
        checked={isChecked} // Ensure the input is controlled
        onChange={onChangeState}
      ></input>
      <path
        className={`${styles.checkbox} ${isChecked ? styles.checkboxactive : ""}`}
        aria-hidden='true'
        viewBox='0 0 15 11'
        fill='none'
      />
      <path d='M1 4.5L5 9L14 1' strokeWidth='2' stroke={isChecked ? "#fff" : "none"} />
    </label>
  );
};

export default Checkboxer;
