import React from "react";
import styles from "./NotFound.module.scss";
import images from "../../data/images1";
import { NavHashLink } from "react-router-hash-link";
const NotFound = () => {
  return (
    <div className={styles.NotFoundContainer}>
      <div className={styles.carbunelWrap}>
        <img alt="page not found cartoon image" className={styles.coalCartoon} src={images.coalCartoon} />
        <h1>{"Pagina nu există"}</h1>
        <h2>{"Din păcate Nelu Cărbunelu' nu gasește pagina, este posibil ca ea să nu mai existe!"}</h2>
        <NavHashLink replace to={"/"}>
          <button>{"Du-mă la pagina principala"}</button>
        </NavHashLink>
      </div>
    </div>
  );
};
export default NotFound;
