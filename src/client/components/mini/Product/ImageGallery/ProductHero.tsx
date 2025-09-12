import React, { useState } from "react";
import styles from "./../ProductView.module.scss";
import CountdownTimer from "../Countdown/CountdownTimer";
import ProductAdded from "../../PopUps/ProductAdded";
import parse from "html-react-parser";
import images from "../../../../data/images";
import strings from "../../../../data/strings.json";
import { ProductListType } from "../../../../utils/OrderInterfaces";
import { sendTriggerEmail } from "../../../../services/triggers";
import { fireConfettiTwo } from "../../../Confetti/ConfettiTwo";

interface ProductHeroProps {
  productListUpdated: ProductListType;
  ID: number;
  addCartHandler: () => void;
  countdownAllowed: boolean;
  dateToday: Date;
  popProductInCart: boolean;
  setpopProductInCart: React.Dispatch<React.SetStateAction<boolean>>;
  animEnded: () => void;
  toggleUploadPopup: () => void;
}

const ProductHero = ({
  productListUpdated,
  ID,
  addCartHandler,
  countdownAllowed,
  dateToday,
  popProductInCart,
  setpopProductInCart,
  animEnded,
  toggleUploadPopup,
}: ProductHeroProps) => {
  let { ProductPreview: content } = strings;
  if (!productListUpdated || !productListUpdated[ID]) {
    return <div>Product not found</div>; // You can handle this however you'd like
  }
  const [mainPicture, setmainPicture] = useState<number>(0);
  const product = productListUpdated[ID];

  const currentDate = new Date();
  const remainingTime = {
    hours: 23 - currentDate.getHours(),
    minutes: 59 - currentDate.getMinutes(),
    seconds: 59 - currentDate.getSeconds(),
  };

  const addToCartEvent = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (typeof addCartHandler === "function") {
      addCartHandler();
      setpopProductInCart(true);

      const { clientX, clientY } = event;
      fireConfettiTwo(clientX / window.innerWidth, clientY / window.innerHeight);
    }
    sendTriggerEmail({ typeEvent: "ADD_TO_CART_EVENT", url: window.location.pathname });
  };

  return (
    <div className={styles.sectionParent}>
      {/* Left Section: Image Gallery */}
      <div className={styles.leftSection}>
        <div className={styles.leftContainer}>
          {productListUpdated?.[ID]?.imageProduct?.[mainPicture] && (
            <div className={styles.imageActualContainer}>
              <img
                alt='product for selling'
                className={styles.imageContainer}
                src={productListUpdated[ID].imageProduct[mainPicture]}
              />
            </div>
          )}
          {productListUpdated != null ? (
            <div className={styles.previewImageContainer}>
              {productListUpdated &&
                productListUpdated[ID] &&
                productListUpdated[ID].imageProduct?.length > 1 &&
                productListUpdated[ID].imageProduct.map((image: string, index: number) => {
                  return (
                    <div
                      key={index}
                      onClick={() => setmainPicture(index)}
                      className={mainPicture === index ? styles.activeImage : styles.clickableImage}
                    >
                      <img alt='product for selling' className={styles.innerImage} src={image} />
                    </div>
                  );
                })}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Right Section: Product Details and Actions */}
      <div className={styles.rightSection}>
        <div className={styles.rightContainer}>
          <h3 className={styles.productTitle}>{product != null ? productListUpdated[ID].title : "..."}</h3>

          {/* Review Section */}
          <div className={styles.reviewContainer}>
            <div className={styles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <img key={i} alt='stars icons' className={styles.reviewStar} src={images.star} />
              ))}
            </div>
          </div>

          {/* Description */}
          {productListUpdated && (
            <>
              <div className={styles.shortDescription}>
                <p>{parse(productListUpdated[ID].shortDescription)}</p>
              </div>
              <div className={styles.longDescription}>{parse(productListUpdated[ID].firstDescription)}</div>
            </>
          )}

          {/* Price and Countdown Timer */}
          {productListUpdated && (
            <>
              <div className={styles.priceWrapper}>
                <div className={styles.productPriceOld}>
                  {Number(productListUpdated[ID].price) + Number(productListUpdated[ID].price) * 0.45 + " LEI"}
                </div>
                <div className={styles.productPrice}>{productListUpdated[ID].price + " LEI"}</div>
                {countdownAllowed && (
                  <div className={styles.oldPrice}>
                    {parse(
                      `Ofertă valabilă până la <br>ora 23:59 - ${dateToday.getDate()}.${
                        dateToday.getMonth() + 1
                      }.${dateToday.getUTCFullYear()} `
                    )}
                    <CountdownTimer
                      hours={remainingTime.hours}
                      minutes={remainingTime.minutes}
                      seconds={remainingTime.seconds}
                      className={styles.timerActual}
                    />
                  </div>
                )}
              </div>

              {/* Mini Album Upload Button */}
              {window.location.href.includes("mini-album") && (
                <div className={styles.actionContainer}>
                  <button onClick={toggleUploadPopup} className={styles.addToCart}>
                    {content.uploadminialbum}
                  </button>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className={styles.actionContainer}>
                <button onClick={addToCartEvent} className={styles.addToCart}>
                  {content.addToCartText}
                </button>
              </div>
            </>
          )}

          {/* Product Added Pop-up */}
          {popProductInCart && <ProductAdded animFin={animEnded} id={ID} />}
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
