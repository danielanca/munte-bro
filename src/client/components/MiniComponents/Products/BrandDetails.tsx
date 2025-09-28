import React from "react";
import parse from "html-react-parser";
import styles from "./BrandDetails.module.scss";
import { BrandDetailsStr } from "../../../data/strings.json";
const BrandDetails = () => {
  return (
    <div className={styles.brandContainer}>
      <h3>{BrandDetailsStr.title}</h3>
      <div className={styles.details}>
        <h4>{parse(BrandDetailsStr.description)}</h4>
      </div>
    </div>
  );
};

export default BrandDetails;
