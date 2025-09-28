import React, { useState } from "react";
import ProductAdded from "../PopUps/ProductAdded";
import ProductDescription from "../ConstantComponents/ProductDescription";
import { ProductTypes } from "../../utils/OrderInterfaces";
import { HiOutlineShoppingBag } from "react-icons/hi";

import styles from "./ProductView.module.scss";
import images from "../../data/images";
import strings from "../../data/strings.json";

const ProductPreview = ({
  productListUpdated,
  ID,
  addCartHandler,
  productCountQuantity,
  productQuantityIncrement,
  productQuantityDecrement
}: ProductTypes) => {
  let { ProductPreview: content } = strings;
  const [mainPicture, setmainPicture] = useState<number>(0);
  const [popProductInCart, setpopProductInCart] = useState<boolean>(false);

  const [productCount, setProductCount] = useState<number>(1);

  const handleIncrement = () => {
    setProductCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    if (productCount > 1) {
      setProductCount((prevCount) => prevCount - 1);
    }
  };

  const onImageClicked = (event: number) => {
    setmainPicture(event);
    console.log(event);
  };

  const addToCartEvent = () => {
    if (typeof addCartHandler === "function") {
      addCartHandler();
      setpopProductInCart(true);
    }
  };

  const animEnded = () => {
    setpopProductInCart(false);
  };

  return (
    <>
      <div className={styles.sectionParent}>
        <div className={styles.productContainerSection}>
          {/* Product Gallery Images */}
          <div className={styles.productGalleryImagesSection}>
            {productListUpdated != null ? (
              <div className={styles.previewImageContainer}>
                {productListUpdated[ID].imageProduct.length > 1 &&
                  productListUpdated[ID].imageProduct.map((image: string, index: number) => {
                    return (
                      <div
                        onClick={onImageClicked.bind(this, index)}
                        className={mainPicture === index ? styles.activeImage : styles.clickableImage}
                      >
                        <img
                          alt="product for selling"
                          className={styles.gallerySingleImage}
                          src={productListUpdated[ID].imageProduct[index]}
                        />
                      </div>
                    );
                  })}
              </div>
            ) : (
              ""
            )}
          </div>

          {/* Product Main Image */}
          <div className={styles.leftSection}>
            <div className={styles.leftContainer}>
              {productListUpdated != null ? (
                <div className={styles.imageActualContainer}>
                  <img
                    alt="product for selling"
                    className={styles.imageContainer}
                    src={productListUpdated[ID].imageProduct[mainPicture]}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.rightContainer}>
              <div>
                <div className={styles.titlePriceContainer}>
                  <h3 className={styles.productTitle}>
                    {productListUpdated != null ? productListUpdated[ID].title : "..."}
                  </h3>
                  <div className={styles.reviewContainer}>
                    <div className={styles.starsContainer}>
                      <img alt="stars icons" className={styles.reviewStar} src={images.star} />
                      <img alt="stars icons" className={styles.reviewStar} src={images.star} />
                      <img alt="stars icons" className={styles.reviewStar} src={images.star} />
                      <img alt="stars icons" className={styles.reviewStar} src={images.star} />
                      <img alt="stars icons" className={styles.reviewStar} src={images.star} />
                    </div>
                   
                  </div>
                  {productListUpdated && (
                    <div className={styles.productsPricesContainer}>
                      {productListUpdated[ID].discountedPrice && (
                        <div className={styles.priceContainerWithDiscount}>
                          <div className={styles.discountedPriceWrapper}>
                            <div className={styles.productDiscountedPriceHead}>PRET:</div>
                            <div className={styles.productDiscountedPrice}>
                              {productListUpdated[ID].discountedPrice + " LEI "}
                            </div>
                          </div>
                          <div className={styles.priceWrapper}>
                            <div className={styles.productPriceHead}>Only: </div>
                            <div className={styles.productPrice}>{productListUpdated[ID].price + " LEI"}</div>
                          </div>
                        </div>
                      )}
                      {!productListUpdated[ID].discountedPrice && (
                        <div className={styles.priceContainerWithoutDiscount}>
                          <div className={styles.productPriceHead}>PRET: </div>
                          <div className={styles.productPrice}>{productListUpdated[ID].price + " LEI"}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {productListUpdated && (
                    <div className={styles.productsPricesContainer}>
                      {productListUpdated[ID].realStock &&
                        productListUpdated[ID].realStockCheck === "true" &&
                        productListUpdated[ID].fakeStockCheck !== "true" && (
                          <div className={styles.priceContainerWithDiscount}>
                            <div className={styles.discountedPriceWrapper}>
                              <div className={styles.productDiscountedPriceHead}>Stock:</div>
                              <div className={styles.realStock}>{productListUpdated[ID].realStock}</div>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                  {productListUpdated && (
                    <div className={styles.productsPricesContainer}>
                      {productListUpdated[ID].fakeStock && productListUpdated[ID].fakeStockCheck === "true" && (
                        <div className={styles.priceContainerWithDiscount}>
                          <div className={styles.discountedPriceWrapper}>
                            <div className={styles.productDiscountedPriceHead}>Stock:</div>
                            <div className={styles.realStock}>{productListUpdated[ID].fakeStock}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* First product quantity counter */}
                  <div className={styles.counterContainer}>
                    <button onClick={productQuantityDecrement} className={styles.decrementButton}>
                      -
                    </button>
                    <span className={styles.productCount}>{productCountQuantity}</span>
                    <button onClick={productQuantityIncrement} className={styles.incrementButton}>
                      +
                    </button>
                  </div>

                 
                </div>
              </div>

              {productListUpdated && (
                <>
                  <div className={styles.shortDescription}>{productListUpdated[ID].shortDescription}</div>
                  <div className={styles.longDescription}>{productListUpdated[ID].firstDescription}</div>
                </>
              )}

              {productListUpdated && (
                <div className={styles.actionContainer}>
                  <div onClick={addToCartEvent} className={styles.addToCart}>
                    <div className={styles.addToCartButtonDiv}>
                      <HiOutlineShoppingBag style={{ paddingRight: "6px" }} />
                      <button className={styles.addToCartButton}>{content.addToCartText}</button>
                    </div>
                  </div>
                </div>
              )}

              {productListUpdated && (
                <div className={styles.buyNowContainer}>
                  <button className={styles.buyNowButton}>CUMPARĂ ACUM</button>
                </div>
              )}

              {popProductInCart && <ProductAdded animFin={animEnded} id={ID} />}
            </div>
          </div>
        </div>

        {productListUpdated && <ProductDescription productDescription={productListUpdated} productID={ID} />}
      </div>
    </>
  );
};

export default ProductPreview;
