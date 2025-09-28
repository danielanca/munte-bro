import React, { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import styles from "./ProductItemNew.module.scss";
import ReactStarRatings from "react-star-ratings";

// If you already have a central ProductListItem type, import it and delete this.
type ProductListItem = {
  ID: string;
  title: string;
  imageProduct: string[];
  price: string | number;
  productTotalReviews?: number | string;
};

type ProductsDict = Record<string, ProductListItem>;

interface StarRatingProps {
  rating: number;
  changeRating: (newRating: number) => void;
  // ✅ accept dict or null (was `string`)
  realProductsToShow: ProductsDict | null;
}

const ProductItemNew: React.FC<StarRatingProps> = ({
  rating,
  changeRating,
  realProductsToShow,
}) => {
  const [starSize, setStarSize] = useState(18);

  useEffect(() => {
    const handleResize = () => {
      // check smallest first
      if (window.innerWidth <= 576) setStarSize(12);
      else if (window.innerWidth <= 920) setStarSize(16);
      else setStarSize(18);
    };
    handleResize(); // set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Normalize to array for rendering
  const items: ProductListItem[] = Object.values(realProductsToShow ?? {});

  if (items.length === 0) {
    return (
      <div className={styles.productParentContainer}>
        Right now we don’t have any products. Please wait a few minutes or contact support.
      </div>
    );
  }

  return (
    <div className={styles.productParentContainer}>
      {items.map((item) => (
        <HashLink
          key={item.ID}
          to={`/produs/${item.ID}`}
          className={styles.singleProductContainer}
          onClick={() => {
            /* window.scrollTo({ top: 0, behavior: "smooth" }); */
          }}
        >
          <div>
            <img src={item.imageProduct?.[0]} alt={item.title} className={styles.productImage} />
          </div>

          <div className={styles.productTitle}>{item.title}</div>

          <div className={styles.reviewStarRatings}>
            <div className={styles.stars}>
              <ReactStarRatings
                rating={rating}
                starRatedColor="#3A5A40"
                starHoverColor="#3A5A40"
                starDimension={`${starSize}px`}
                starSpacing="2px"
                changeRating={changeRating}
                numberOfStars={5}
                name="rating"
              />
            </div>
            <div>{item.productTotalReviews ?? 0}</div>
          </div>

          <div className={styles.productPrice}>
            {typeof item.price === "number" ? item.price.toFixed(2) : item.price} Lei
          </div>
        </HashLink>
      ))}
    </div>
  );
};

export default ProductItemNew;
