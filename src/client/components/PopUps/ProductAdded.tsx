// components/PopUps/ProductAdded.tsx
import React from "react";
import { NavHashLink } from "react-router-hash-link";
import { AiOutlineClose } from "react-icons/ai";
import { ProductsFromSessionStorage } from "../../data/constants";
import styles from "./ProductAdded.module.scss";
import strings from "../../data/strings.json";

interface ProductProps {
  id: string;
  animFin: () => void;
  title?: string;       // ✅ new
  image?: string;       // ✅ new
}

const ProductAdded = ({ id, animFin, title, image }: ProductProps) => {
  const { MyCart } = strings as any;

  // Safe fallback to session cache (only if props missing)
  let fallbackTitle = "Produs adăugat";
  let fallbackImage = "";
  try {
    const raw = sessionStorage.getItem(ProductsFromSessionStorage);
    if (raw) {
      const data = JSON.parse(raw);
      const p = data?.[id];
      if (p) {
        fallbackTitle = p.title ?? fallbackTitle;
        fallbackImage = p.imageProduct?.[0] ?? "";
      }
    }
  } catch {
    // ignore
  }

  const resolvedTitle = title || fallbackTitle;
  const resolvedImage = image || fallbackImage;

  const onAnimationEnd = () => animFin();
  const onClose = () => animFin();

  return (
    <div onAnimationEnd={onAnimationEnd} className={styles.cartCardboard}>
      <div className={styles.innerContainer}>
        <div className={styles.productBasket}>
          <div className={styles.closeContainer}>
            <AiOutlineClose style={{ cursor: "pointer" }} onClick={onClose} />
          </div>

          <div className={styles.firstRowContainer}>
            <div className={styles.cartLogoStyle}>
              {resolvedImage ? (
                <img alt="cart logo" className={styles.cartIcon} src={resolvedImage} />
              ) : (
                <div className={styles.cartIcon} aria-hidden />
              )}
            </div>
            <div className={styles.outerProductTitle}>
              <div className={styles.titleProduct}>
                <h3>{resolvedTitle}</h3>
              </div>
              <div className={styles.cosulTextContainer}>
                <h4>A fost adăugat în coșul de cumpărături!</h4>
              </div>
            </div>
          </div>

          <div className={styles.buttonsContainer}>
            <div className={styles.veziCosulContainer}>
              <NavHashLink to={"/cosulmeu"}>
                <button className={styles.veziCosulButton} onClick={onClose}>VEZI COȘUL</button>
              </NavHashLink>
            </div>

            <div className={styles.finalizeazaComandaContainer}>
              <NavHashLink to={MyCart.finishOrder.link}>
                <button className={styles.finalizeazaComandaButton} onClick={onClose}>
                  FINALIZEAZĂ COMANDA
                </button>
              </NavHashLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdded;
