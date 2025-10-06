import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "../Comments/Comments";
import ProductPreview from "./ProductPreview";
import Loader from "../MiniComponents/Loader";
import SuggestionArea from "../SuggestedProducts/SuggestionArea";
import ReactGA from "react-ga4";
import { CartInfoItemCookie, ProductsFromSessionStorage } from "./../../data/constants";
import type { ProductListType, CartProps, ProductListItem } from "./../../utils/OrderInterfaces";
import { NotExistingProduct } from "../../data/strings.json";
import images from "../../data/images1";
import styles from "./ProductView.module.css";
import { useScrollSense, useSenseScreen } from "../hooks/senseHook/useScrollSense";
import { getProductById } from "../../services/products";

type StoredCartItem = { id: string; itemNumber: string };

const ProductView = ({ notifyMe }: CartProps) => {
  const [productCountQuantity, setProductCountQuantity] = useState<number>(1);
  const productQuantityIncrement = () => setProductCountQuantity((q) => q + 1);
  const productQuantityDecrement = () => setProductCountQuantity((q) => Math.max(0, q - 1)); // allow 0

  const params = useParams();
  const ID = params.productID ?? "";
  const ref = useRef<HTMLDivElement | null>(null);

  const [productMap, setProductMap] = useState<ProductListType | undefined>();
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "notfound" | "error">("idle");

  useScrollSense(() => {
    ReactGA.event("scroll_bottom", { page: window.location.pathname });
  });
  useSenseScreen(ref, window.location.pathname);

  useEffect(() => {
    let alive = true;
    if (!ID) return;

    setStatus("loading");
    setProductMap(undefined);

    (async () => {
      try {
        const prod = await getProductById(ID);
        if (!alive) return;

        if (prod) {
          // keep preview prop shape
          const map = { [ID]: prod } as ProductListType;
          setProductMap(map);
          setStatus("loaded");

          // GA view_item
          ReactGA.event("view_item", {
            item_id: ID,
            item_name: (prod as any).title ?? "",
            price: Number((prod as any).discountedPrice ?? (prod as any).price ?? 0) || undefined,
          });

          // ensure ProductAdded popup has data
          try {
            const raw = sessionStorage.getItem(ProductsFromSessionStorage);
            const current = raw ? JSON.parse(raw) : {};
            if (!current[ID]) {
              current[ID] = prod;
              sessionStorage.setItem(ProductsFromSessionStorage, JSON.stringify(current));
            }
          } catch {}
        } else {
          setStatus("notfound");
        }
      } catch (e) {
        console.error("Failed to load product:", e);
        if (alive) setStatus("error");
      }
    })();

    return () => {
      alive = false;
    };
  }, [ID]);

  const addCartHandler = () => {
    if (productCountQuantity <= 0) return; // don't add zero
    const productId = String(ID);
    const expectedData = localStorage.getItem(CartInfoItemCookie);
    let storedCart: StoredCartItem[] = expectedData ? JSON.parse(expectedData) : [];

    const existing = storedCart.find((i) => i.id === productId);
    if (existing) {
      const nextQty = Number(existing.itemNumber) + Number(productCountQuantity);
      existing.itemNumber = String(nextQty);
    } else {
      storedCart.push({ id: productId, itemNumber: String(productCountQuantity) });
    }

    localStorage.setItem(CartInfoItemCookie, JSON.stringify(storedCart));
    notifyMe(Math.floor(Math.random() * 100));
  };

  const product: ProductListItem | undefined = productMap?.[ID];

  return (
    <div className={styles.productViewParentContainer}>
      <div ref={ref} className={styles.padder}>
        {status === "loading" && <Loader />}

        {status === "loaded" && product && (
          <ProductPreview
            addCartHandler={addCartHandler}
            ID={ID}
            productListUpdated={productMap!}
            productCountQuantity={productCountQuantity}
            productQuantityIncrement={productQuantityIncrement}
            productQuantityDecrement={productQuantityDecrement}
          />
        )}

        {(status === "notfound" || status === "error") && (
          <div className={styles.noProductFoundContainer}>
            <h2 className={styles.warningHeadline}>
              {status === "notfound" ? NotExistingProduct.warningHeadline : "A apărut o eroare"}
            </h2>
            <div className={styles.noProductWrapper}>
              <img src={images.noProduct} alt="Product not found" />
            </div>
            <h2 className={styles.warningHeadline}>
              {status === "notfound" ? NotExistingProduct.productNotFound : "Reîncearcă mai târziu."}
            </h2>
          </div>
        )}
      </div>

      {status === "loaded" && product && (
        <Comments
          productData={JSON.stringify(productMap)}
          productID={ID}
          reviewsList={(product as any).reviews ?? []}
        />
      )}

      {status === "loaded" && <SuggestionArea productID={ID} />}
    </div>
  );
};

export default ProductView;
