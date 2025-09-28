import React, { useRef } from "react";
import { useOutsideClicker } from "./../../hooks/onScreen";
import styles from "./PopModal.module.scss";

interface ModalPopProps {
  title: string;
  eventHandler: (event: string, payload: string) => void;
}

const PopModal = ({ title, eventHandler }: ModalPopProps) => {
  const backdropRef = useRef(null);

  useOutsideClicker(backdropRef, () => {
    eventHandler("modal_Event", "NO");
  });

  const confirmAnswer = () => {
    eventHandler("modal_Event", "YES");
  };
  const cancelAnswer = () => {
    eventHandler("modal_Event", "CANCEL");
  };

  return (
    <div ref={backdropRef} className={styles.popUpBackdrop}>
      <div className={styles.boxModal}>
        <div className={styles.centerQuestion}>
          <h2>{title}</h2>
        </div>
        <div className={styles.centerControls}>
          <button onClick={confirmAnswer} className={styles.greenButton}>
            {"Confirm"}
          </button>
          <button onClick={cancelAnswer} className={styles.redButton}>
            {"Renunta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopModal;
