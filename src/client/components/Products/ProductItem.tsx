import React from "react";
import { HashLink } from "react-router-hash-link";
import { ProdItemProps } from "../../utils/OrderInterfaces";
import styles from "./../../components/Products/ProductItem.module.scss";
import strings from "../../data/strings.json";

const ProductItem = ({ productObject, size }: ProdItemProps) => {
  let { ProductItem: ProductItemStrings } = strings;

  const gotoElement = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSize = () => {
    if (size != null && size === "small") {
      return styles.productItemSmall;
    } else {
      return styles.productItem;
    }
  };

 

  return (
    <HashLink onClick={gotoElement} className={styles.HashLinkStyle} to={"/produs/" + productObject.ID}>
      <div className={renderSize()}>
        <div className={styles.imageWrap}>
          <img className={styles.productImage} src={productObject.imageProduct[0]} alt={productObject.title}></img>
        </div>
        <div className={styles.titleWrap}>
          <span className={styles.productTitle}>{productObject.title}</span>
        </div>

        <div className={styles.priceWrap}>
          <span className={styles.productPrice}>{productObject.price + ` ${ProductItemStrings.Currency}`}</span>
        </div>
        {/* Add onClick event handler to trigger confetti */}
        <button  className={styles.ProductItem_addToCart}>
          {ProductItemStrings.SeeProduct}
        </button>
        {/* <div className={styles.discountWrap}>
          <p className={styles.discountText}>{'REDUCERE'}</p>
        </div> */}
      </div>
    </HashLink>
  );
};

export default ProductItem;
