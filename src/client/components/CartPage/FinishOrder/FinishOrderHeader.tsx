import React from "react";
import styles from "../FinishOrder.module.css";

type Props = {
  title: string;
  infoText: string;
  imageSrc: string;
  imageAlt?: string;
};

const FinishOrderHeader: React.FC<Props> = ({ title, infoText, imageSrc, imageAlt = "Delivery" }) => {
  return (
    <>
      <div className={styles.topTitle}>
        <div className={styles.cartLine} />
        <h3 className={styles.finishOrderTitle}>{title}</h3>
        <div className={styles.cartLine} />
      </div>

      <div className={styles.infoBoxing}>
        <img src={imageSrc} alt={imageAlt} />
        <h3>{infoText}</h3>
      </div>
    </>
  );
};

export default FinishOrderHeader;
