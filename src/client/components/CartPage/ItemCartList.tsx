import React from "react";
import { HashLink } from "react-router-hash-link";
import styles from "./ItemCartList.module.scss";
import { ProductsFromSessionStorage, CartInfoItemCookie } from "../../data/constants";

interface itemCart {
  productID: string;
  amount: number;
  updateRequest: () => void;
}
interface LocalStorageProps {
  id: string;
  itemNumber: string;
}
const getCartData = () => {
  let expectedData: string | null = localStorage.getItem(CartInfoItemCookie);
  return expectedData !== null ? JSON.parse(expectedData) : null;
};
const ItemCartList = ({ productID, updateRequest }: itemCart) => {
  let storedCart: LocalStorageProps[] = [];
  let sessionFlat = sessionStorage.getItem(ProductsFromSessionStorage);
  let sessionProducts = sessionFlat !== null ? JSON.parse(sessionFlat) : null;

  let value: number = 0;

  storedCart = getCartData();
  storedCart.forEach(item => {
    if (item.id === productID) {
      value = Number(item.itemNumber);
    }
  });

  const addOneItem = () => {
    storedCart = getCartData();
    storedCart.forEach(item => {
      if (item.id === productID) {
        item.itemNumber = (Number(item.itemNumber) + 1).toString();
        value = Number(item.itemNumber);
      }
    });

    localStorage.setItem(CartInfoItemCookie, JSON.stringify(storedCart));
    updateRequest();
  };

  const removeOneItem = () => {
    storedCart = getCartData();
    if (storedCart !== null) {
      storedCart.forEach(item => {
        if (item.id === productID) {
          if (Number(item.itemNumber) > 1) {
            item.itemNumber = (Number(item.itemNumber) - 1).toString();
            value = Number(item.itemNumber);
          }
        }
      });
      localStorage.setItem(CartInfoItemCookie, JSON.stringify(storedCart));
    }

    updateRequest();
  };

  const deleteProduct = () => {
    storedCart = getCartData();
    let index_del: number = 0;
    storedCart.forEach((item, index) => {
      console.log(item);
      if (item.id === productID.toString()) {
        index_del = index;
      }
    });
    storedCart.splice(index_del, 1);
    localStorage.setItem(CartInfoItemCookie, JSON.stringify(storedCart));
    updateRequest();
  };
  return (
    <div className={styles.cartWrapper}>
      <div className={"col-sm-8 col-xs-12 " + styles.productItem}>
        <HashLink className={styles.HashLinkStyle} to={"/produs/" + productID}>
          <div className={styles.productBox}>
            <div className={styles.imageContainer}>
              <img className={styles.productImage} src={sessionProducts[productID].imageProduct[0]} />
            </div>

            <div className={styles.productDetails}>
              <h3 className={styles.titleInCart}>{sessionProducts[productID].title}</h3>
              <p className={styles.priceInCart}>
                {sessionProducts[productID].price + " LEI"}
                {value > 1 ? <p className={styles.quietPadder}> {"x " + value}</p> : ""}
              </p>
            </div>
          </div>
        </HashLink>
      </div>
      <div className={"col-sm-4 col-xs-12 " + styles.quantityBox}>
        <div className={styles.addRemoveCart}>
          <button onClick={addOneItem} className={styles.cartPlus}>
            {"+"}
          </button>
          <div className={styles.cartPrice}>{value}</div>
          <button onClick={removeOneItem} className={styles.cartMinus}>
            {"-"}
          </button>
        </div>
        <div>
          <div onClick={deleteProduct} className={styles.deleteProductCart}>
            {"Sterge Produs"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCartList;
