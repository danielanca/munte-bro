import React from "react";
import styles from "./../Products/FeaturedText.module.scss";

interface TextProps {
  text: {
    title: string;
    textSmall: string;
  };
}
const FeaturedText = ({ text }: TextProps) => {
  return (
    <div className={styles.newProductText}>
      <h3 className={styles.backText}>{text.title}</h3>
      <div className={styles.textContainer}>
        <h4 className={styles.newProductTitle}>{text.textSmall}</h4>
      </div>
    </div>
  );
};

export default FeaturedText;
