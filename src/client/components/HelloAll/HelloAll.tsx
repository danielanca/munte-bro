import React from "react";
import styles from "./HelloAll.module.scss";
import images from "./../../data/images";
const HelloAll = () => {
  return (
    <div className={styles.helloAll}>
      <div className={styles.featuredMessage}>
        <img alt='bear logo' className={styles.bearLogo} src={images.bearPicture} />
        <h3 className={styles.textWelcome}>{"Creati Amintiri cu familia"}</h3>
      </div>
    </div>
  );
};
export default HelloAll;
