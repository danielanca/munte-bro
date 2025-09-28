import React from "react";
import styles from "./ButtonNice.module.scss";

interface ButtonNiceProps {
  title: string;
  urlSufix: string;
}

const ButtonNice = ({ title, urlSufix }: ButtonNiceProps) => {
  return (
    <a className={styles.buttonStyle} href={"https://diniubire.ro/" + urlSufix}>
      <button>{title}</button>
    </a>
  );
};

export default ButtonNice;
