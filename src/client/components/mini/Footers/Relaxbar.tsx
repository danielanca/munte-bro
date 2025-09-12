import React from "react";

import styles from "./Relaxbar.module.scss";
import { sendTriggerEmail } from "../../../services/triggers";
const Relaxbar = () => {
  // const goToTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };
  return (
    <div className={styles.relaxSpace}>
      <div className={styles.cardobard}>
        {/* <div className={styles.rowContainer}> */}
        <div className={styles.rowContainer}>
          <div className={styles.colContainer}>
            <div className={styles.leftBro}>
              <img
                className={styles.mediaSocial}
                src={
                  "https://firebasestorage.googleapis.com/v0/b/diniubire-89ce0.appspot.com/o/ProductMedia%2FinstagramPNG.png?alt=media&token=a6742b2a-702b-4aef-85fa-a54ae52a1495"
                }
              />
            </div>
          </div>
          <div className={styles.colContainer}>
            <div className={styles.rightBro}>
              <div className={styles.socialLogo}>
                <img
                  className={styles.picImage}
                  src={
                    "https://firebasestorage.googleapis.com/v0/b/diniubire-89ce0.appspot.com/o/ProductMedia%2FRectangle%205.png?alt=media&token=fcc5fa21-7677-488c-9296-4f49d1b4628a"
                  }
                />
              </div>
              <div className={styles.actionWrapper}>
                <a href="https://instagram.com/diniubire.ro" target={"_blank"}>
                  <button
                    onClick={() => sendTriggerEmail({ typeEvent: "INSTA_CLICK", url: window.location.pathname })}
                    className={styles.instagramButton}
                  >
                    Viziteaza-ne
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relaxbar;
