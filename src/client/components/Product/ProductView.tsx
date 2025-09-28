import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Comments from "../Comments/Comments";
import ProductPreview from "./ProductPreview";
import Loader from "../MiniComponents/Loader";
import SuggestionArea from "../SuggestedProducts/SuggestionArea";
import ReactGA from "react-ga4";
import { getProductWithID } from "../../data/productList";
import { CartInfoItemCookie } from "./../../data/constants";
import { ProductListType, CartProps } from "./../../utils/OrderInterfaces";
import { NotExistingProduct } from "../../data/strings.json";
import images from "../../data/images1";
import styles from "./ProductView.module.scss";
import { useScrollSense, useSenseScreen } from "../hooks/senseHook/useScrollSense";


// keep cart items consistent with your interfaces
type StoredCartItem = { id: string; itemNumber: string };

const ProductView = ({ notifyMe, productQuantity }: CartProps) => {
  // const [productCount, setProductCount] = useState<number>(1); // unused, can remove
  const [productCountQuantity, setProductCountQuantity] = useState<number>(1);

  // quantity handlers
  const productQuantityIncrement = () => setProductCountQuantity((q) => q + 1);
  const productQuantityDecrement = () =>
    setProductCountQuantity((q) => (q > 1 ? q - 1 : q));

  const params = useParams();
  const ID = params.productID ?? "";
  const ref = useRef<HTMLDivElement | null>(null);

  const [productListUpdated, setProducts] = useState<ProductListType>();

  useScrollSense(() => {
    ReactGA.event(`User scrolled to bottom on [${window.location.pathname}]`);
    console.log(`User scrolled to bottom on [${window.location.pathname}]`);
  });
  useSenseScreen(ref, window.location.pathname);

  // fetch once per ID
  useEffect(() => {
    if (!productListUpdated) {
      getProductWithID(ID).then((finalData) => setProducts(finalData));
    }
  }, [ID, productListUpdated]);

  const addCartHandler = () => {
    const productId = String(ID);

    // read cart
    const expectedData = localStorage.getItem(CartInfoItemCookie);
    let storedCart: StoredCartItem[] = expectedData ? JSON.parse(expectedData) : [];

    // try to find existing item
    const existing = storedCart.find((i) => i.id === productId);
    if (existing) {
      const nextQty = Number(existing.itemNumber) + Number(productCountQuantity);
      existing.itemNumber = String(nextQty); // ✅ keep as string
    } else {
      storedCart.push({
        id: productId,
        itemNumber: String(productCountQuantity), // ✅ string, not number
      });
    }

    // persist
    localStorage.setItem(CartInfoItemCookie, JSON.stringify(storedCart));

    // trigger a UI refresh counter (your current pattern)
    notifyMe(Math.floor(Math.random() * 100));
  };

  return (
    <div className={styles.productViewParentContainer}>
      <div ref={ref} className={styles.padder}>
        {productListUpdated != null && Object.prototype.hasOwnProperty.call(productListUpdated, ID) ? (
          <ProductPreview
            addCartHandler={addCartHandler}
            ID={ID}
            productListUpdated={productListUpdated}
            productCountQuantity={productCountQuantity}
            productQuantityIncrement={productQuantityIncrement}
            productQuantityDecrement={productQuantityDecrement}
          />
        ) : (
          <Loader />
        )}
      </div>

      <div>
        {typeof productListUpdated !== "undefined" && Object.prototype.hasOwnProperty.call(productListUpdated, ID) ? (
          <Comments
            productData={JSON.stringify(productListUpdated)}
            productID={ID}
            reviewsList={productListUpdated[ID].reviews}
          />
        ) : (
          typeof productListUpdated !== "undefined" &&
          !Object.prototype.hasOwnProperty.call(productListUpdated, ID) && (
            <div className={styles.noProductFoundContainer}>
              <h2 className={styles.warningHeadline}>{NotExistingProduct.warningHeadline}</h2>
              <div className={styles.noProductWrapper}>
                <img src={images.noProduct} alt="Product not found" />
              </div>
              <h2 className={styles.warningHeadline}>{NotExistingProduct.productNotFound}</h2>
            </div>
          )
        )}
      </div>

      {productListUpdated && <SuggestionArea productID={ID} />}
    </div>
  );
};

export default ProductView;
