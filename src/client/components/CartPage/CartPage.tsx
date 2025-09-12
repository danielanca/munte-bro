import React, { useState } from "react";
import { NavHashLink } from "react-router-hash-link";
import { useAppContext } from "./../../AppContext";
import { productConstants } from "../../data/componentStrings";
import uniqueId from "lodash/uniqueId";
import { CartInfoItemCookie, ProductsFromSessionStorage } from "../../data/constants";
import ItemCartList from "./ItemCartList";
import { ProductSessionProps, ProductCookiesProps } from "./typeProps";
import strings from "../../data/strings.json";
import styles from "./CartPage.module.scss";

const makeCheck = (sessionData: ProductSessionProps, cartData: ProductCookiesProps[]) => {
  let namesNotFound: string[] = [];

  cartData.forEach(item => {
    if (sessionData != null && !sessionData.hasOwnProperty(item.id)) {
      namesNotFound.push(item.id);
    }
  });

  return cartData.filter(filterItem => !namesNotFound.includes(filterItem.id));
};

const CartPage = () => {
  if (typeof window === "undefined") {
    return;
  }
  const { setCartItems } = useAppContext();

  let { MyCart: cartString } = strings;
  const [updateMade, setupdateMade] = useState<number>(1);
  let subtotalPrepare = 0;
  let expectedData = localStorage.getItem(CartInfoItemCookie);
  let sessionProducts: ProductSessionProps | null;
  let storedCart: ProductCookiesProps[] | null = null;
  let shippingFee = productConstants.shippingFee;
  let sessionFlat = sessionStorage.getItem(ProductsFromSessionStorage);

  if (typeof sessionFlat === "string") {
    sessionProducts = JSON.parse(sessionFlat);
  } else {
    sessionProducts = null;
  }

  if (sessionProducts !== null && expectedData != null) {
    storedCart = JSON.parse(expectedData);
    if (storedCart != null) {
      storedCart = makeCheck(sessionProducts, storedCart);
      storedCart.map(item => {
        if (sessionProducts != null) {
          subtotalPrepare += Number(sessionProducts[item.id].price) * Number(item.itemNumber);
        }
      });
    }
  }

  // const productNotification = () => {
  //   setupdateMade(updateMade + 1);
  //   setCartItems(getCartItems());
  // };

  const productNotification = () => {
    setupdateMade(updateMade + 1);
    setCartItems(getCartItems() ?? 0); 
  };
  

  const goToPage = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // window.location.href = cartString.finishOrder.link;
  };

  const displayFinishOrderDialog = () => {
    if (subtotalPrepare > 0) {
      return (
        <NavHashLink className={styles.hashTransparent} to={cartString.finishOrder.link}>
          <button className={styles.finishOrder}>{cartString.finishOrder.text}</button>
        </NavHashLink>
      );
    }
  };
  return (
    <>
      <div className={styles.CartSection}>
        <div className={styles.topTitle}>
          <div className={styles.cartLine} />
          <h3 className={styles.middleCosText}>{cartString.cartShopping}</h3>
          <div className={styles.cartLine} />
        </div>

        {displayFinishOrderDialog()}
        <div className={styles.actualCartBox}>
          <div className={styles.topline}>
            <div className={styles.productCartPage}>
              <h3 className={styles.cartProductTitle}>{cartString.product}</h3>
            </div>
            <div className={styles.quantityCartPage}>
              <h3 className={styles.cartProductTitle}>{cartString.quantity}</h3>
            </div>
          </div>

          {subtotalPrepare !== 0 ? (
            storedCart != null &&
            storedCart.map(item => (
              <ItemCartList
                key={uniqueId()}
                productID={item.id}
                amount={Number(item.itemNumber)}
                updateRequest={productNotification}
              />
            ))
          ) : (
            <div className={styles.emptyCart}>{cartString.emptyCart}</div>
          )}
        </div>
        {subtotalPrepare > 0 && (
          <div className={styles.actualCheckout}>
            <div className={styles.bottomLeft}></div>
            <div className={styles.bottomRight}>
              <div className={styles.checkoutTotal}>
                <h3>{cartString.totalCart}</h3>
                <div className={styles.subtotalContainer}>
                  <div className={styles.subtotalLine + " row "}>
                    <div className={styles.innerAlign}>
                      <p className={styles.toRight}>{`${cartString.subTotal}:`}</p>
                    </div>
                    <div className={styles.innerPrice}>
                      <p className={styles.subtotalStyle}>{`${subtotalPrepare} ${cartString.currency}`}</p>
                    </div>
                  </div>
                  <div className={styles.deliveryLine + " row"}>
                    <div className={styles.innerAlign}>
                      <p className={styles.toRight}>{`${cartString.subTotal}:`}</p>
                    </div>
                    <div className={styles.innerPrice}>
                      <p
                        className={styles.subtotalStyle}
                      >{`${cartString.sendingInfo}:  ${shippingFee} ${cartString.currency}`}</p>
                    </div>
                  </div>
                  <div className={styles.totalLine + " row"}>
                    <div className={styles.innerAlign}>
                      <p className={styles.toRight}>{`${cartString.total}:`}</p>
                    </div>
                    <div className={styles.innerPrice}>
                      <p className={styles.subtotalStyle}>{`${subtotalPrepare + shippingFee}.00 ${
                        cartString.VATincluded
                      }`}</p>
                    </div>
                  </div>
                  <div className={styles.finishTheOrderBox}>
                    <NavHashLink className={styles.hashTransparent} to={cartString.finishOrder.link}>
                      <button onClick={goToPage} className={styles.finishOrder}>
                        {cartString.finishOrder.text}
                      </button>
                    </NavHashLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;

export const getCartItems = () => {
  if (typeof window === "undefined") {
    return null;
  }
  let itemFromSessionS = sessionStorage.getItem(ProductsFromSessionStorage);
  let sessionProducts: ProductSessionProps | null = itemFromSessionS && JSON.parse(itemFromSessionS);
  let storedCart: ProductCookiesProps[] | null = null;
  let expectedData = localStorage.getItem(CartInfoItemCookie);
  storedCart = expectedData && JSON.parse(expectedData);

  if (expectedData != null && sessionProducts != null) {
    let totalItems = 0;
    let storedCart = JSON.parse(expectedData);
    storedCart = makeCheck(sessionProducts, storedCart);
    storedCart.map((item: ProductCookiesProps) => {
      totalItems = totalItems + Number(item.itemNumber);
    });
    return totalItems;
  } else return 0;
};
