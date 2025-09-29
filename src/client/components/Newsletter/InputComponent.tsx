import React, { useCallback, useState } from "react";
import styles from "./InputComponent.module.scss";

interface InputProps {
  typeOfInput?: string;
  title?: string;
  onSwitchEnabled?: (value: boolean, titleName?: string) => void;
  theme?: string;
  enabled?: boolean;
}

const InputComponent = ({ enabled, onSwitchEnabled, typeOfInput, title, theme }: InputProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(enabled !== undefined ? enabled : false);

  const onChangeState = useCallback(() => {
    if (onSwitchEnabled != null) {
      onSwitchEnabled(!isChecked, title);
      setIsChecked(!isChecked);
    }
  }, [isChecked]);

  const themeLayout = () => {
    if (theme === "blue") {
      return `${styles.checkboxBlue}  ${isChecked ? styles.checkboxblueActive : ""}`;
    } else {
      return `${styles.checkbox} ${isChecked ? styles.checkboxactive : ""}`;
    }
  };

  return (
    <label className={theme === "blue" ? styles.termRow : styles.labelRow}>
      <input className={styles.inputCustom} type={typeOfInput} onChange={onChangeState}></input>

      <path className={themeLayout()} aria-hidden="true" viewBox="0 0 15 11" fill="none" />
      <path d="M1 4.5L5 9L14 1" strokeWidth="2" stroke={isChecked ? "#fff" : "none"} />

      {title}
    </label>
  );
};

export default InputComponent;
