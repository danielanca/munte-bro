import React from "react";
import { NavHashLink } from "react-router-hash-link";
import { AiOutlineClose } from "react-icons/ai";
import { ProductsFromSessionStorage } from "../../data/constants";
import styles from "./ProductAdded.module.scss";
import strings from "../../data/strings.json";

interface ProductProps {
  id: string;
  // id: any;
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
          <div className={styles.closeContainer}>
            <AiOutlineClose style={{ cursor: "pointer" }} />
          </div>
          <div className={styles.firstRowContainer}>
            <div className={styles.cartLogoStyle}>
              <img alt="cart logo" className={styles.cartIcon} src={data[id].imageProduct[0]} />
            </div>
            <div className={styles.outerProductTitle}>
             
              <div className={styles.titleProduct}>
                <h3>{data != null ? data[id].title : ""}</h3>
              </div>
              <div className={styles.cosulTextContainer}>
                <h4>A fost adaugat in cosul de cumparaturi !</h4>
              </div>
            </div>
          </div>

          {/* PopUp Buttons */}
          <div className={styles.buttonsContainer}>
            <div className={styles.veziCosulContainer}>
              <NavHashLink to={"/cosulmeu"}>
                <button className={styles.veziCosulButton}>VEZI COSUL</button>
              </NavHashLink>
            </div>

            <div className={styles.finalizeazaComandaContainer}>
              <NavHashLink to={MyCart.finishOrder.link}>
                <button className={styles.finalizeazaComandaButton}>FINALIZEAZA COMANDA</button>
              </NavHashLink>
            </div>
          </div>
         
        </div>
        
      </div>
    </div>
  );
};

export default ProductAdded;
