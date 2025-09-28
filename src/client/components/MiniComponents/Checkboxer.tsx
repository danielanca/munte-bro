import React, { useCallback, useEffect, useState } from "react";
import styles from "./Checkboxer.module.scss";

interface InputProps {
  name?: string;
  onSwitchEnabled: (value: boolean, optionChoosed?: string) => void;
  enabled?: boolean;
}

const Checkboxer = ({ name, enabled, onSwitchEnabled }: InputProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(enabled !== undefined ? enabled : false);

  const onChangeState = useCallback(() => {
    if (typeof name === "string") {
      onSwitchEnabled(!isChecked, name);
    } else {
      onSwitchEnabled(!isChecked);
    }
    setIsChecked(!isChecked);
  }, [isChecked]);

  useEffect(() => {
    enabled !== undefined && onSwitchEnabled(isChecked);
  }, [enabled]);

  return (
    <label className={styles.labelRow}>
      <input className={styles.checkboxer} type={"checkbox"} onChange={onChangeState}></input>
      <path
        className={`${styles.checkbox} ${isChecked ? styles.checkboxactive : ""}`}
        aria-hidden="true"
        viewBox="0 0 15 11"
        fill="none"
      />
      <path d="M1 4.5L5 9L14 1" strokeWidth="2" stroke={isChecked ? "#fff" : "none"} />
    </label>
  );
};

export default Checkboxer;
