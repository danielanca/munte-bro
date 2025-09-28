import React, { useEffect, useMemo, useState } from "react";
import { NavHashLink } from "react-router-hash-link";
import { uniqueId } from "lodash";
import { productConstants } from "../../data/componentStrings";
import { CartInfoItemCookie, ProductsFromSessionStorage } from "../../data/constants";
import ItemCartList from "./ItemCartList";
import { ProductSessionProps, ProductCookiesProps, CartProps } from "./typeProps1";
import strings from "../../data/strings.json";
import styles from "./CartPage1.module.scss";
import { AiOutlinePercentage } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { getCuponData, Cupon } from "../../data/CuponFetch";

const makeCheck = (sessionData: ProductSessionProps, cartData: ProductCookiesProps[]) => {
  const missing: string[] = [];
  for (const item of cartData) {
    if (sessionData && !Object.prototype.hasOwnProperty.call(sessionData, item.id)) {
      missing.push(item.id);
    }
  }
  return cartData.filter((x) => !missing.includes(x.id));
};

const CartPage = ({ notifyMe }: CartProps) => {
  const [cuponData, setCuponData] = useState<Cupon[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [cuponCode, setCuponCode] = useState<string>("");
  const [cuponDiscount, setCuponDiscount] = useState<number>(0);
  const [updateMade, setUpdateMade] = useState<number>(1);

  const { MyCart: cartString } = strings;
  const deliveryFee = Number(productConstants.shippingFee);

  // Load session products (catalog) and cart
  const sessionProducts: ProductSessionProps | null = useMemo(() => {
    const flat = sessionStorage.getItem(ProductsFromSessionStorage);
    return typeof flat === "string" ? (JSON.parse(flat) as ProductSessionProps) : null;
  }, []);

  const storedCart: ProductCookiesProps[] | null = useMemo(() => {
    const expectedData = localStorage.getItem(CartInfoItemCookie);
    return expectedData ? (JSON.parse(expectedData) as ProductCookiesProps[]) : null;
  }, [updateMade]);

  const filteredCart = useMemo(() => {
    if (!sessionProducts || !storedCart) return null;
    return makeCheck(sessionProducts, storedCart);
  }, [sessionProducts, storedCart]);

  const subtotalPrepare = useMemo(() => {
    if (!sessionProducts || !filteredCart) return 0;
    return filteredCart.reduce((sum, item) => {
      const price = Number(sessionProducts[item.id]?.price ?? 0);
      return sum + price * Number(item.itemNumber ?? 0);
    }, 0);
  }, [sessionProducts, filteredCart]);

  const productNotification = () => {
    setUpdateMade((n) => n + 1);
    notifyMe(updateMade + 1);
  };

  // Fetch cupons once
  useEffect(() => {
    (async () => {
      try {
        const data = await getCuponData();
        setCuponData(data);
      } catch (err) {
        console.error("Error fetching Cupon Data:", err);
      }
    })();
  }, []);

  // Handle cupon input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trim());
  };

  // Resolve the currently typed cupon
  useEffect(() => {
    const match = cuponData.find(
      (c) => c.cuponCode?.toLowerCase() === inputValue.toLowerCase()
    );
    if (match) {
      setCuponCode(match.cuponCode);
      setCuponDiscount(Number(match.cuponDiscount) || 0);
    } else {
      setCuponCode("");
      setCuponDiscount(0);
    }
  }, [inputValue, cuponData]);

  // Totals
  const subtotal = Number(subtotalPrepare);
  const totalBeforeDiscount = subtotal + deliveryFee;
  const discountAmount = (Number(cuponDiscount) / 100) * totalBeforeDiscount;
  const finalTotal = totalBeforeDiscount - discountAmount;
  const formattedTotal = ` ${finalTotal.toFixed(2)} ${cartString.currency}`;

  const displayFinishOrderDialog = () => (
    <NavHashLink className={styles.hashTransparent} to={cartString.finishOrderCosulmeu.link}>
      <button className={styles.finishOrder}>
        {cuponDiscount > 0 ? `Cupon ${cuponCode}` : cartString.finishOrderCosulmeu.text}
      </button>
    </NavHashLink>
  );

  return (
    <div className={styles.parentContainer}>
      <div className={styles.CartSection}>
        <div className={styles.mainParentContainer}>
          <div className={styles.leftContainer}>
            {subtotalPrepare !== 0 && filteredCart ? (
              filteredCart.map((item) => (
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

            <div className={styles.discountContainer}>
              <span className={styles.percentIconContainer}>
                <AiOutlinePercentage className={styles.percentIcon} />
              </span>
              <p className={styles.discountText}>
                10% Discount la urmatoarea comanda cu codul : DINMUNTE1
              </p>
            </div>
          </div>

          <div className={styles.rightContainer}>
            <div className={styles.rightChild}>
              <h1 className={styles.comandaTitle}>Comanda</h1>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotal}>{` ${cartString.subTotal} `}</span>
                <span className={styles.subTotal}>
                  {`${subtotalPrepare} ${cartString.currency}`}
                </span>
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotal}>Discount</span>
                <span className={styles.subTotal}>{`0.00 ${cartString.currency}`}</span>
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotal}>Delivery</span>
                <span className={styles.subTotal}>
                  {`${deliveryFee} ${cartString.currency}`}
                </span>
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotal}>Cupon Reducere</span>
                <span className={styles.subTotal}>{`${Number(cuponDiscount)} %`}</span>
              </div>

              <div className={styles.totalPriceTopBorderContainer}>
                <hr className={styles.totalPriceTopBorder} />
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotalTotal}>{` ${cartString.total} `}</span>
                <span className={styles.subTotalTotalPrice}>
                  {`${subtotal + deliveryFee} ${cartString.currency}`}
                </span>
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotalTotal}>{`Discounted ${cartString.total} `}</span>
                <span className={styles.subTotalTotalPrice}>{formattedTotal}</span>
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.EstimareExpediereText}>Estimare Expediere</span>
                <span className={styles.cuponTime}>01 Feb, 2023</span>
              </div>

              {/* Cupon Input */}
              <div className={styles.cuponInputFormContainer}>
                <input
                  placeholder="Cupon Reducere"
                  className={styles.cuponInputForm}
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <MdOutlineLocalOffer style={{ fontSize: "25px" }} className={styles.cuponIconForInput} />
              </div>

              {displayFinishOrderDialog()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

// Utility used outside the component
export const getCartItems = () => {
  const itemFromSessionS = sessionStorage.getItem(ProductsFromSessionStorage);
  const sessionProducts: ProductSessionProps | null =
    itemFromSessionS ? (JSON.parse(itemFromSessionS) as ProductSessionProps) : null;

  const expectedData = localStorage.getItem(CartInfoItemCookie);
  let cart: ProductCookiesProps[] | null = expectedData ? (JSON.parse(expectedData) as ProductCookiesProps[]) : null;

  if (!expectedData || !sessionProducts || !cart) return 0;

  cart = makeCheck(sessionProducts, cart);
  return cart.reduce((acc, item) => acc + Number(item.itemNumber ?? 0), 0);
};
