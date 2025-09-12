import React from "react";
import styles from "./StarDisplayer.module.scss";

import images from '../../../../data/images';

interface StarsProps {
  starScore: string;
}

const StarDisplayer = ({ starScore }: StarsProps) => {
  let lastHalf = false;
  if (Number(starScore) % 1 !== 0) lastHalf = true;

  return (
    <div className={styles.starVisualizer}>
      {Array.from({ length: Number(starScore) }, (item) => {
        return <img alt="star icon" className={styles.starIcon} src={images.star} />;
      })}
    </div>
  );
};

export default StarDisplayer;
