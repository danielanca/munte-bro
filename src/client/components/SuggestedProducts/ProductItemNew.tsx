import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import styles from "./ProductItemNew.module.css";
import ReactStarRatings from "react-star-ratings";
import { useCart } from "../context/CartProvider";
import ProductAdded from "../PopUps/ProductAdded";

type ProductListItem = {
  ID: string;
  title: string;
  imageProduct: string[];
  price: string | number;
  discountedPrice?: string;
  productTotalReviews?: number | string;
  createdAt?: any;
  updatedAt?: any;
};

type ProductsDict = Record<string, ProductListItem>;

interface StarRatingProps {
  rating: number;
  changeRating: (newRating: number) => void;
  realProductsToShow: ProductsDict | null;
  onAddToCart?: (productId: string) => void;
}

const ProductItemNew: React.FC<StarRatingProps> = ({
  rating,
  changeRating,
  realProductsToShow,
  onAddToCart,
}) => {
  const [starSize, setStarSize] = useState(18);
  const [popProductInCart, setPopProductInCart] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [addedTitle, setAddedTitle] = useState<string>("");   // ✅
  const [addedImage, setAddedImage] = useState<string>("");   // ✅

  const { addItem } = useCart();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) setStarSize(12);
      else if (window.innerWidth <= 920) setStarSize(16);
      else setStarSize(18);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const createdAtToDate = (createdAt: any): Date | null => {
    try {
      if (!createdAt) return null;
      if (typeof createdAt?.toMillis === "function") return new Date(createdAt.toMillis());
      const d = new Date(createdAt);
      return isNaN(d.getTime()) ? null : d;
    } catch { return null; }
  };

  const isNewProduct = (createdAt: any): boolean => {
    const d = createdAtToDate(createdAt);
    if (!d) return false;
    const diffDays = Math.ceil(Math.abs(Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const hasDiscount = (price: string | number, discountedPrice?: string): boolean => {
    if (!discountedPrice) return false;
    const priceNum = typeof price === "string" ? parseFloat(price.replace(",", ".")) : price;
    const discountedNum = parseFloat(discountedPrice.replace(",", "."));
    return Number.isFinite(priceNum) && Number.isFinite(discountedNum) && discountedNum < priceNum;
  };

  const formatPrice = (price: string | number): string =>
    typeof price === "number" ? price.toFixed(2) : price;

  const calculateDiscountPercentage = (price: string | number, discountedPrice: string): string => {
    const priceNum = typeof price === "string" ? parseFloat(price.replace(",", ".")) : price;
    const discountedNum = parseFloat(discountedPrice.replace(",", "."));
    if (!Number.isFinite(priceNum) || !Number.isFinite(discountedNum) || priceNum <= 0) return "";
    return `-${Math.round(((priceNum - discountedNum) / priceNum) * 100)}%`;
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string, title: string, img: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof addItem === "function") addItem(productId, 1);
    else if (onAddToCart) onAddToCart(productId);

    setAddedId(productId);
    setAddedTitle(title);     // ✅ pass to popup
    setAddedImage(img);       // ✅ pass to popup
    setPopProductInCart(true);
  };

  const animEnded = () => {
    setPopProductInCart(false);
    setAddedId(null);
    setAddedTitle("");
    setAddedImage("");
  };

  const items: ProductListItem[] = Object.values(realProductsToShow ?? {});
  if (items.length === 0) {
    return <div className={styles.empty}>Momentan nu avem produse.</div>;
  }

  return (
    <>
      <div className={styles.grid}>
        {items.map((item) => {
          const img = item.imageProduct?.[0] ?? "";
          const isNew = isNewProduct(item.createdAt);
          const hasDisc = hasDiscount(item.price, item.discountedPrice);
          const displayPrice = item.discountedPrice && hasDisc ? item.discountedPrice : formatPrice(item.price);
          const originalPrice = hasDisc ? formatPrice(item.price) : null;

          return (
            <HashLink
              key={item.ID}
              to={`/produs/${item.ID}`}
              className={styles.card}
              title={item.title}
              aria-label={item.title}
            >
              {(isNew || hasDisc) && (
                <div className={styles.badgeContainer}>
                  {isNew && <div className={`${styles.badge} ${styles.badgeNew}`}>Nou</div>}
                  {hasDisc && item.discountedPrice && (
                    <div className={`${styles.badge} ${styles.badgeDiscount}`}>
                      {calculateDiscountPercentage(item.price, item.discountedPrice)}
                    </div>
                  )}
                </div>
              )}

              <figure className={styles.media}>
                {img ? (
                  <img src={img} alt={item.title} className={styles.image} />
                ) : (
                  <div className={styles.imageFallback}>Fără imagine</div>
                )}
              </figure>

              <h3 className={styles.title}>
                <span className={styles.titleText}>{item.title}</span>
              </h3>

              <div className={styles.meta}>
                <div className={styles.starsWrap}>
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
                <span className={styles.reviews}>{item.productTotalReviews ?? 0}</span>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.priceContainer}>
                  <span className={styles.currentPrice}>{displayPrice} Lei</span>
                  {originalPrice && <span className={styles.originalPrice}>{originalPrice} Lei</span>}
                </div>
                <span className={styles.priceUnit}>/ Bucată</span>
              </div>

              <button
                className={styles.addToCartBtn}
                onClick={(e) => handleAddToCart(e, item.ID, item.title, img)}
                aria-label={`Adaugă ${item.title} în coș`}
              >
                Adaugă în Coș
              </button>
            </HashLink>
          );
        })}
      </div>

      {popProductInCart && addedId && (
        <ProductAdded
          animFin={animEnded}
          id={addedId}
          title={addedTitle}   // ✅
          image={addedImage}   // ✅
        />
      )}
    </>
  );
};

export default ProductItemNew;
