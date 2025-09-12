import React from "react";
import { NavHashLink } from "react-router-hash-link";

import { ProductsFromSessionStorage } from "../../../data/constants";
import styles from "./ProductAdded.module.scss";
import strings from "../../../data/strings.json";

interface ProductProps {
  id: string | number;
  animFin: () => void;
}
const ProductAdded = ({ id, animFin }: ProductProps) => {
  let { MyCart, cart } = strings;
  let sessionData = sessionStorage.getItem(ProductsFromSessionStorage);

  let data = sessionData != null ? JSON.parse(sessionData) : null;
  const animationFinished = () => {
    animFin();
  };

  const gotoFinishOrderPage = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div onAnimationEnd={animationFinished} className={styles.cartCardboard}>
      <div className={styles.innerContainer}>
        <div className={styles.productBasket}>
          <div className={styles.cartLogoStyle}>
            <img alt='cart logo' className={styles.cartIcon} src={data[id].imageProduct[0]} />
          </div>
          <div className={styles.outerProductTitle}>
            <div className={styles.productTitle}>
              <h2>{"Produs adaugat in cos"}</h2>
            </div>
            <div className={styles.titleProduct}>
              <h3>{data != null ? data[id].title : ""}</h3>
            </div>
            <div className={styles.starsContainerOuter}>
              {
                // displayStars(5, "small")
              }
            </div>
          </div>
          <div className={styles.actionContainer}>
            <NavHashLink to={MyCart.finishOrder.link}>
              <button onClick={gotoFinishOrderPage} className={styles.finishButton}>
                {"Finalizare comanda"}
              </button>
            </NavHashLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdded;
