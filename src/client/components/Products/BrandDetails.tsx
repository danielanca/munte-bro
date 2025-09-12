import React from "react";
import parse from "html-react-parser";
import styles from "./BrandDetails.module.scss";
import {BrandDetailsStr} from '../../data/strings.json';

const BrandDetails = () => {
  return (
    <div className={styles.brandContainer}>
      <h3>{BrandDetailsStr.title}</h3>
      <div className={styles.details}>
        <h4>{parse(BrandDetailsStr.description)}</h4>
        {/* <div className={styles.statsThree}>
          <div className={styles.item}>
            <h2>{"220.000+"}</h2>
            <h4>{"clienti fericiti"}</h4>
          </div>
          <div className={styles.item}>
            <h2>{"10"}</h2>
            <h4>{"Țări în care activăm"}</h4>
          </div>
          <div className={styles.item}>
            <h2>{"4"}</h2>
            <h4>{"Ani de DinIubire.Ro"}</h4>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BrandDetails;
