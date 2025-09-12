import React from "react";
import styles from "./ProductView.module.scss";
import images from '../../../data/images';

export const displayStars = (value: number, width: string) => {
  return (
    <div className={width === "normal" ? styles.starsContainer : styles.starsContainerLow}>
      <img alt="stars icons" className={styles.reviewStar} src={images.star} />
      <img alt="stars icons" className={styles.reviewStar} src={images.star} />
      <img alt="stars icons" className={styles.reviewStar} src={images.star} />
      <img alt="stars icons" className={styles.reviewStar} src={images.star} />
      <img alt="stars icons" className={styles.reviewStar} src={images.star} />
    </div>
  );
};
