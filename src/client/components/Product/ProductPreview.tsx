// components/ProductView/ProductPreview.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductAdded from "../PopUps/ProductAdded";
import { ProductTypes } from "../../utils/OrderInterfaces";
import { HiOutlineShoppingBag } from "react-icons/hi";
import ReactStarRatings from "react-star-ratings";
import styles from "./ProductView.module.css";
import strings from "../../data/strings.json";
import { useCart } from "../context/CartProvider";

const asNumber = (v: unknown) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v.replace(",", "."));
  return 0;
};
const fmtRON = (n: number) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const isImageUrl = (s: string) =>
  /^https?:\/\/[^\s)]+?\.(png|jpe?g|gif|webp|svg)(\?[^\s)]*)?$/i.test(s);
const pullImagesFromText = (text?: string) => {
  if (!text) return { clean: "", imgs: [] as string[] };
  const imgs: string[] = [];
  const clean = text
    .replace(
      /(https?:\/\/[^\s)]+?\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s)]*)?)/gi,
      (m) => {
        imgs.push(m);
        return "";
      }
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { clean, imgs };
};
const getAmbiance = (p: Record<string, any>) => {
  const keys = ["ambiance", "ambienta", "ambiente", "ambiences", "ambianceImages", "lifestyleImages"];
  const out: string[] = [];
  for (const k of keys) {
    const v = p?.[k];
    if (Array.isArray(v)) v.forEach((u) => typeof u === "string" && isImageUrl(u) && out.push(u));
  }
  return out;
};

const ProductPreview = ({
  productListUpdated,
  ID,
  addCartHandler,
  productCountQuantity,
  productQuantityIncrement,
  productQuantityDecrement,
}: ProductTypes) => {
  const { ProductPreview: content } = strings as any;
  const { addItem } = useCart();

  const product = productListUpdated?.[ID];
const imgList = (product as any)?.imageProduct; // read once
const imagesArr: string[] = Array.isArray(imgList)
  ? (imgList as unknown[]).filter((u): u is string => typeof u === "string" && u.length > 0)
  : [];
  const [mainPicture, setMainPicture] = useState<number>(0);
  const [popProductInCart, setPopProductInCart] = useState<boolean>(false);

  const price = useMemo(() => asNumber(product?.price), [product]);
  const stock = useMemo(() => asNumber(product?.realStock), [product]);

  const rating = useMemo(() => asNumber((product as any)?.rating), [product]);
  const totalReviews = useMemo(() => {
    const pr = product as any;
    if (typeof pr?.productTotalReviews !== "undefined") return asNumber(pr.productTotalReviews);
    if (pr?.reviews && typeof pr.reviews === "object") return Object.keys(pr.reviews).length;
    return 0;
  }, [product]);

  const onImageClicked = (index: number) => setMainPicture(index);

  const qty = Math.max(0, typeof productCountQuantity === "number" ? productCountQuantity : 1);

  const addToCartEvent = () => {
    if (qty <= 0 || stock <= 0) return;
    addItem(ID, qty);
    setPopProductInCart(true);
  };

  const animEnded = () => setPopProductInCart(false);

  const rawLongText: string = useMemo(
    () => (product?.jsonContent as string) || (product?.firstDescription as string) || "",
    [product]
  );
  const { clean: longTextClean, imgs: imagesInText } = useMemo(() => pullImagesFromText(rawLongText), [rawLongText]);
  const ulBeneficii: string[] = useMemo(
    () => (Array.isArray((product as any)?.ULbeneficii) ? (product as any).ULbeneficii.filter(Boolean) : []),
    [product]
  );
  const ambianceImages: string[] = useMemo(() => getAmbiance(product ?? {}), [product]);
  const descriptionBlocks: string[] = useMemo(
    () => longTextClean.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean),
    [longTextClean]
  );

  if (!product) return null;

  const addDisabled = qty === 0 || stock <= 0;

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.breadcrumb}>
        <Link to="/">Acasă</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{product.title}</span>
      </nav>

      <div className={styles.productContainerSection}>
        <div className={styles.leftSection}>
          <div className={styles.mainImageContainer}>
            {imagesArr.length > 0 && (
              <img
                src={imagesArr[Math.min(mainPicture, imagesArr.length - 1)]}
                alt={product.title}
                className={styles.mainImage}
              />
            )}
          </div>

          {imagesArr.length > 1 && (
            <div className={styles.thumbnailsContainer}>
              {imagesArr.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`${product.title} ${index + 1}`}
                  className={`${styles.thumbnail} ${mainPicture === index ? styles.thumbnailActive : ""}`}
                  onClick={() => onImageClicked(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.rightSection}>
          <div className={styles.productHeader}>
            <h1 className={styles.productTitle}>{product.title}</h1>

            {totalReviews > 0 && (
              <div className={styles.ratingContainer}>
                <div className={styles.starsContainer}>
                  <ReactStarRatings
                    rating={rating > 0 ? rating : 5}
                    starRatedColor="#3A5A40"
                    starDimension="20px"
                    starSpacing="2px"
                    numberOfStars={5}
                    name="rating"
                  />
                </div>
                <span className={styles.reviewCount}>{totalReviews} review-uri</span>
              </div>
            )}
          </div>

          <div className={styles.priceSection}>
            <div className={styles.currentPrice}>{fmtRON(price)} LEI</div>
            {typeof (product as any)?.priceUnit === "string" && (product as any).priceUnit.trim() !== "" && (
              <div className={styles.priceUnit}>{(product as any).priceUnit}</div>
            )}
          </div>

          <div className={styles.stockInfo}>
            <span className={stock > 0 ? styles.stockBadge : styles.stockBadgeOos}>
              {stock > 0 ? "În stoc" : "Stoc epuizat"}
            </span>
            <div className={styles.stockText}>{stock} bucăți disponibile</div>
            {typeof (product as any)?.deliveryInfo === "string" && (product as any).deliveryInfo.trim() !== "" && (
              <div className={styles.deliveryInfo}>{(product as any).deliveryInfo}</div>
            )}
          </div>

          {product.shortDescription && (
            <div className={styles.shortDescription}>{product.shortDescription}</div>
          )}

          <div className={styles.quantitySection}>
            <label className={styles.quantityLabel}>Cantitate:</label>
            <div className={styles.quantitySelector}>
              <button onClick={productQuantityDecrement} className={styles.quantityButton} aria-label="Scade">
                –
              </button>
              <span className={styles.quantityDisplay}>{qty}</span>
              <button onClick={productQuantityIncrement} className={styles.quantityButton} aria-label="Crește">
                +
              </button>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              className={styles.addToCartBtn}
              onClick={addToCartEvent}
              disabled={addDisabled}
              aria-disabled={addDisabled}
            >
              <HiOutlineShoppingBag />
              {content.addToCartText}
            </button>
            <button className={styles.buyNowBtn}>CUMPĂRĂ ACUM</button>
          </div>

          <div className={styles.productMeta}>
            {((product as any)?.code || ID) && (
              <div className={styles.productCode}>
                <span className={styles.codeLabel}>Cod produs:</span>
                <span className={styles.codeValue}>{(product as any)?.code || ID}</span>
              </div>
            )}
          </div>

          <div className={styles.detailsSection}>
            {descriptionBlocks.length > 0 && (
              <>
                <h3 className={styles.detailsHeading}>Descriere</h3>
                {descriptionBlocks.map((blk, i) => {
                  const isList = /^(\s*[-•]\s+)/m.test(blk);
                  if (isList) {
                    const items = blk.split(/\n/).map((ln) => ln.trim()).filter(Boolean);
                    return (
                      <ul key={`blk-${i}`} className={styles.detailsList}>
                        {items.map((ln, j) => (
                          <li key={`li-${i}-${j}`}>{ln.replace(/^[-•]\s*/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={`p-${i}`} className={styles.detailsParagraph}>
                      {blk}
                    </p>
                  );
                })}
              </>
            )}

            {ulBeneficii.length > 0 && (
              <>
                <h3 className={styles.detailsHeading}>Beneficii</h3>
                <ul className={styles.detailsListBig}>
                  {ulBeneficii.map((b, i) => (
                    <li key={`benef-${i}`}>{b}</li>
                  ))}
                </ul>
              </>
            )}

            {imagesInText.length > 0 && (
              <>
                <h3 className={styles.detailsHeading}>Imagini din descriere</h3>
                <div className={styles.detailsImageGrid}>
                  {imagesInText.map((src, idx) => (
                    <figure key={`descimg-${idx}`} className={styles.detailsFigure}>
                      <img loading="lazy" src={src} alt={`descriere ${idx + 1}`} />
                    </figure>
                  ))}
                </div>
              </>
            )}

            {ambianceImages.length > 0 && (
              <>
                <h3 className={styles.detailsHeading}>Ambianță</h3>
                <div className={styles.detailsImageGrid}>
                  {ambianceImages.map((src, idx) => (
                    <figure key={`amb-${idx}`} className={styles.detailsFigure}>
                      <img loading="lazy" src={src} alt={`ambianță ${idx + 1}`} />
                    </figure>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {popProductInCart && <ProductAdded animFin={animEnded} id={ID} />}
    </div>
  );
};

export default ProductPreview;
