import React, { useEffect } from 'react';
import { HashLink as Link, NavHashLink } from "react-router-hash-link";
import strings from "../../data/strings.json";
import styles from "./OrderDone.module.scss";
import parse from "html-react-parser";
import { fireConfetti } from '../Confetti/Confetti'; 

const OrderDone = () => {
  let { OrderDone: doneString } = strings;

  // Fire confetti when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    fireConfetti();
  }, []); 

  return (
    <div role={"contentinfo"} className={"row " + styles.confirmContainer} style={{ paddingTop: '150px', paddingBottom: '200px' }}>
      <div className={styles.horizontalAlign}>
        <p className={styles.text}>{doneString.title}</p>
        <p className={styles.miniText}>{parse(doneString.subtitle)}</p>
      </div>
      <div className={styles.horizontalAlign}>
        <NavHashLink className={styles.HashLinkStyle} to="/">
          <button className={styles.buttonToHome}>{doneString.goHome}</button>
        </NavHashLink>
      </div>
    </div>
  );
};

export default OrderDone;
