// ProductItemDetailsNew.tsx
import React, { useEffect, useMemo, useState } from "react";
import { HashLink } from "react-router-hash-link";
import ReactStarRatings from "react-star-ratings";
import styles from "./ProductItemDetails.module.scss";
import strings from "../../data/strings.json";

// Re-use your project types (adjust the import path if different)
import type { ProductListItem, ProductListArray, ProductListType } from "../../utils/OrderInterfaces";

type ProductDataIn = ProductListArray | ProductListType | null | undefined;

interface ProductItemDetailsNewProps {
  productData: ProductDataIn;
}

const ProductItemDetailsNew: React.FC<ProductItemDetailsNewProps> = ({ productData }) => {
  const { ProductItem: ProductItemStrings } = strings as any;

  // normalize to a flat array for rendering
  const items: ProductListItem[] = useMemo(() => {
    if (!productData) return [];
    return Array.isArray(productData)
      ? productData
      : (Object.values(productData) as ProductListItem[]);
  }, [productData]);

  const gotoElement = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const [starSize, setStarSize] = useState(18);
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setStarSize(w <= 576 ? 12 : w <= 920 ? 16 : 18);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (items.length === 0) {
    return (
      <div className={styles.productParentContainer}>
        Right now we don’t have any products. Please try again in a few minutes or contact us.
      </div>
    );
  }

  return (
    <div className={styles.productParentContainer}>
      {items.map((item) => {
        const img = item.imageProduct?.[0];
        return (
          <div key={item.ID} className={styles.singleProductContainer}>
            <HashLink onClick={gotoElement} to={`/produs/${item.ID}`} className={styles.HashLinkStyle}>
              <div className={styles.productImageContainer}>
                {img ? (
                  <img src={img} alt={item.title} className={styles.productImage} loading="lazy" />
                ) : (
                  <div className={styles.imageFallback} aria-label="No image" />
                )}
              </div>

              <div className={styles.productTitle}>{item.title}</div>

              <div className={styles.reviewStarRatings}>
                <div className={styles.stars}>
                  <ReactStarRatings
                    rating={5}
                    starRatedColor="#3A5A40"
                    starHoverColor="#3A5A40"
                    starDimension={`${starSize}px`}
                    starSpacing="2px"
                    numberOfStars={5}
                    name="rating"
                  />
                </div>
                <div className={styles.productTotalReviews}>{item.productTotalReviews ?? 0}</div>
              </div>

              <div>
                {item.price} {ProductItemStrings?.Currency ?? "RON"}
              </div>
            </HashLink>
          </div>
        );
      })}
    </div>
  );
};

export default ProductItemDetailsNew;
