import React from "react";
import { HashLink } from "react-router-hash-link";
import styles from "./ItemCartList.module.scss";
import { ProductsFromSessionStorage, CartInfoItemCookie } from "../../data/constants";
import { IoIosAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";

interface itemCart {
  productID: string;
  amount: number; 
  updateRequest: () => void;
}
interface LocalStorageProps {
  id: string;
  // id: any;
  itemNumber: string;
}
const getCartData = () => {
  let expectedData: string | null = localStorage.getItem(CartInfoItemCookie);
  return expectedData !== null ? JSON.parse(expectedData) : null;
};
const ItemCartList = ({ productID, amount, updateRequest }: itemCart) => {
    let storedCart: LocalStorageProps[] = [];
  let sessionFlat = sessionStorage.getItem(ProductsFromSessionStorage);
  let sessionProducts = sessionFlat !== null ? JSON.parse(sessionFlat) : null;

let value: number = Number(amount) || 0;  // let value: number = itemBulkQuantity;

  storedCart = getCartData();
  storedCart.forEach((item) => {
    if (item.id === productID) {
      value = Number(item.itemNumber);
    }
  });

  const addOneItem = () => {
    storedCart = getCartData();
    storedCart.forEach((item) => {
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
      storedCart.forEach((item) => {
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
    //styles.cartWrapper +
    <>
      <div className={styles.productContainer}>
        <div className={styles.productItem}>
          <div className={styles.comProductContainer}>
            <div className={styles.productBox}>
              <div className={styles.imageContainer}>
                <img className={styles.productImage} src={sessionProducts[productID].imageProduct[0]} />
              </div>

              <div className={styles.productDetails}>
                <HashLink className={styles.HashLinkStyle} to={"/produs/" + productID}>
                  <h3 className={styles.titleInCart}>{sessionProducts[productID].title}</h3>
                </HashLink>

                <div className={styles.productTipContainer}>
                  <span className={styles.tipHeading}>Tip</span>
                  <span className={styles.tipProperty}>EUCALIPT</span>
                </div>

                {/* Counter */}
                <div className={styles.counterParentContainer}>
                  <div className={styles.counterContainer}>
                    <div className={styles.productAdd} onClick={addOneItem}>
                      <IoIosAdd />
                    </div>
                    <div className={styles.productQuantity}>{value}</div>
                    <div className={styles.productSubtract} onClick={removeOneItem}>
                      <GrFormSubtract />
                    </div>
                  </div>
                  <div onClick={deleteProduct} className={styles.deleteProductCart}>
                    {"ELIMINA"}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.priceContainer}>
              <p className={styles.priceInCart}>{sessionProducts[productID].price + ".00 lei"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemCartList;
