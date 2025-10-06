import React, { useEffect, useMemo, useState } from "react";
import { NavHashLink } from "react-router-hash-link";
import { productConstants } from "../../data/componentStrings";
import ItemCartList from "./ItemCartList";
import strings from "../../data/strings.json";
import styles from "./CartPage1.module.scss";
import { AiOutlinePercentage } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { getCuponData, Cupon } from "../../data/CuponFetch";
import { useCart } from "../context/CartProvider";
// CartPage.tsx


// ✅ unified key + fetch fallback
import { ProductsFromSessionStorage,CartInfoItemCookie } from "../../data/constants";
import { listProducts } from "../../services/products";

const isClient = typeof window !== "undefined";

// Robust RON parser: keeps digits, dot/comma, minus; removes currency/suffixes and thousand dots
const toNumberRON = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v
      .replace(/[^\d.,-]/g, "")         // strip letters / spaces
      .replace(/\.(?=\d{3}(\D|$))/g, "") // remove thousands dots like 1.234
      .replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const CartPage: React.FC = () => {
  const { items } = useCart();

  const [cuponData, setCuponData] = useState<Cupon[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [cuponCode, setCuponCode] = useState("");
  const [cuponDiscount, setCuponDiscount] = useState(0);

  const { MyCart: cartString } = strings as any;
  const deliveryFee = Number(productConstants.shippingFee) || 0;

  // ✅ central product catalog (from SS or fetched)
  const [catalog, setCatalog] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (!isClient) return;

    // try sessionStorage first
    const ss = sessionStorage.getItem(ProductsFromSessionStorage);
    if (ss) {
      try {
        setCatalog(JSON.parse(ss));
      } catch {
        // ignore; we'll refetch below
      }
    }

    // if not present or parse failed -> fetch
    if (!ss) {
      (async () => {
        try {
          const fresh = await listProducts(); // Record<string, ProductModel>
          sessionStorage.setItem(ProductsFromSessionStorage, JSON.stringify(fresh));
          setCatalog(fresh as any);
        } catch (e) {
          console.error("Failed to load products for cart:", e);
        }
      })();
    }
  }, []);

  // price resolver prefers discountedPrice when valid
  const priceFor = (id: string): number => {
    const p = catalog?.[id];
    if (!p) return 0;
    const discounted = toNumberRON(p.discountedPrice);
    const base = toNumberRON(p.price);
    if (discounted > 0 && discounted < base) return discounted;
    return base;
  };

  const subtotal = useMemo(() => {
    if (!catalog || items.length === 0) return 0;
    return items.reduce((sum, it) => sum + priceFor(it.id) * (Number(it.qty) || 0), 0);
  }, [items, catalog]);

  // coupons
  useEffect(() => {
    if (!isClient) return;
    (async () => {
      try {
        const data = await getCuponData();
        setCuponData(data);
      } catch (err) {
        console.error("Error fetching Cupon Data:", err);
      }
    })();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value.trim());

  useEffect(() => {
    const match = cuponData.find((c) => c.cuponCode?.toLowerCase() === inputValue.toLowerCase());
    setCuponCode(match ? match.cuponCode : "");
    setCuponDiscount(match ? Number(match.cuponDiscount) || 0 : 0);
  }, [inputValue, cuponData]);

  const totalBeforeDiscount = subtotal + deliveryFee;
  const discountAmount = (Number(cuponDiscount) / 100) * totalBeforeDiscount;
  const finalTotal = totalBeforeDiscount - discountAmount;

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
            {items.length > 0 ? (
              // ✅ stable keys to avoid remounts
              items.map((item) => <ItemCartList key={item.id} productID={item.id} />)
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
                <span className={styles.subTotal}>{cartString.subTotal}</span>
                <span className={styles.subTotal}>{`${fmt(subtotal)} ${cartString.currency}`}</span>
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotal}>Discount</span>
                <span className={styles.subTotal}>{`${fmt(0)} ${cartString.currency}`}</span>
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotal}>Delivery</span>
                <span className={styles.subTotal}>{`${fmt(deliveryFee)} ${cartString.currency}`}</span>
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotal}>Cupon Reducere</span>
                <span className={styles.subTotal}>{`${Number(cuponDiscount)} %`}</span>
              </div>

              <div className={styles.totalPriceTopBorderContainer}>
                <hr className={styles.totalPriceTopBorder} />
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotalTotal}>{cartString.total}</span>
                <span className={styles.subTotalTotalPrice}>
                  {`${fmt(totalBeforeDiscount)} ${cartString.currency}`}
                </span>
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.subTotalTotal}>{`Discounted ${cartString.total}`}</span>
                <span className={styles.subTotalTotalPrice}>
                  {`${fmt(finalTotal)} ${cartString.currency}`}
                </span>
              </div>

              <div className={styles.subTotalContainer}>
                <span className={styles.EstimareExpediereText}>Estimare Expediere</span>
                <span className={styles.cuponTime}>01 Feb, 2023</span>
              </div>

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

/** Legacy helper for places that still read localStorage directly. Prefer the context. */
export const getCartItems = () => {
  if (typeof window === "undefined") return 0;
  const raw =
    localStorage.getItem(CartInfoItemCookie || "cartData") ||
    localStorage.getItem("cartData");
  if (!raw) return 0;
  try {
    const cart = JSON.parse(raw) as Array<{ id: string; itemNumber: string | number }>;
    return cart.reduce((acc, it) => acc + Number(it.itemNumber ?? 0), 0);
  } catch {
    return 0;
  }
};
