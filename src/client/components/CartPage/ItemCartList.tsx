import React, { useMemo } from "react";
import { HashLink } from "react-router-hash-link";
import styles from "./ItemCartList.module.css";
import { ProductsFromSessionStorage } from "../../data/constants";
import { IoIosAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";
import { useCart } from "../context/CartProvider";

type Props = { productID: string };

// parse "29,00", "1.234,50", "29,00 lei"
const toNumberRON = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v
      .replace(/[^\d.,-]/g, "")          // strip letters/symbols
      .replace(/\.(?=\d{3}(\D|$))/g, "")  // remove thousand dots
      .replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const fmtRON = (n: number) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const ItemCartList: React.FC<Props> = ({ productID }) => {
  const { getQty, increment, decrement, removeItem } = useCart();

  const sessionProducts = useMemo<Record<string, any> | null>(() => {
    try {
      const flat = sessionStorage.getItem(ProductsFromSessionStorage);
      return flat ? (JSON.parse(flat) as Record<string, any>) : null;
    } catch {
      return null;
    }
  }, []);

  const qty = getQty(productID);
  const product = sessionProducts?.[productID];

  const title = product?.title ?? "Produs";
  const img = product?.imageProduct?.[0] ?? "";

  // prefer discountedPrice if valid
  const base = toNumberRON(product?.price ?? 0);
  const disc = toNumberRON(product?.discountedPrice ?? 0);
  const unit = disc > 0 && disc < base ? disc : base;

  const lineTotal = unit * (Number(qty) || 0);

  const onPlus = () => increment(productID, 1);
  const onMinus = () => (qty > 1 ? decrement(productID, 1) : removeItem(productID));
  const onDelete = () => removeItem(productID);

  const disabled = !product || qty <= 0;

  return (
    <div className={styles.productContainer}>
      <div className={styles.productItem}>
        <div className={styles.comProductContainer}>
          <div className={styles.productBox}>
            <div className={styles.imageContainer}>
              {img ? <img className={styles.productImage} src={img} alt={title} /> : null}
            </div>

            <div className={styles.productDetails}>
              <HashLink className={styles.HashLinkStyle} to={`/produs/${productID}`}>
                <h3 className={styles.titleInCart}>{title}</h3>
              </HashLink>

              <div className={styles.counterParentContainer}>
                <div className={styles.counterContainer}>                
                  <button
                    className={styles.productSubtract}
                    onClick={onMinus}
                    aria-label="Scade"
                    disabled={disabled}
                  >
                    <GrFormSubtract />
                  </button>
<div className={styles.productQuantity}>{qty}</div>
                   <button className={styles.productAdd} onClick={onPlus} aria-label="Adaugă" disabled={!product}>
                    <IoIosAdd />
                  </button>
                </div>

                <button onClick={onDelete} className={styles.deleteProductCart} disabled={!product}>
                  ELIMINĂ
                </button>
              </div>
            </div>
          </div>

          <div className={styles.priceContainer}>
            <p className={styles.priceInCart}>{fmtRON(lineTotal)} lei</p>
            {/* (optional) show unit price */}
            {/* <small className={styles.unitPrice}>({fmtRON(unit)} lei / buc)</small> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCartList;
