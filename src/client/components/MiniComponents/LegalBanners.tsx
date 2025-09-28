import React from "react";
import styles from "./LegalBanners.module.scss";
import images from "../../data/images1";

function LegalBanners() {
  return (
    <div className={styles.mainParentContainer}>
      <div className={styles.imagesContainer}>
        <div className={styles.SOLUTIONAREAContainer}>
          <a href="https://anpc.ro/ce-este-sal/" target="_blank">
            <img className={styles.SOLUTIONAREAImg} src={images.SOLUTIONAREA} alt="SOLUTIONAREA" />
          </a>
        </div>
        <div className={styles.ANPCContainer}>
          <a href="https://ec.europa.eu/consumers/odr" target="_blank">
            <img className={styles.ANPCImg} src={images.ANPC} alt="ANPC" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default LegalBanners;
