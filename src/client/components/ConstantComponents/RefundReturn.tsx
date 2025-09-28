import React from "react";
import styles from "./RefundReturn.module.scss";
import images from "../../data/images";
const RefundReturn = () => {
  return (
    <div className={styles.refundContainer}>
      <div className="row">
        <div className="col-12">
          <div className={styles.imageContainer}>
            <img src={images.refundIcon} />
          </div>
          <div className={styles.textArea}>
            <h2>{"Garantam returul banilor integral"}</h2>
            <h3>{"Suntem încrezători în INSTRUCȚIUNILE VIDEO oferite in pachet"}</h3>
            <h4>{"Astfel, dacă nu sunteti mulțumit de rezultatul final primiți banii inapoi."}</h4>
            <h4>{"Fără invocarea unui motiv."}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundReturn;
