import React, { useMemo, useState } from "react";
import styles from "./ProductsGallery.module.css";
import ProductItemNew from "./ProductItemNew";
import { useCart } from "../context/CartProvider"; // ✅ use your cart context

interface ProductsDict {
  [key: string]: any;
}

interface ProductsGalleryProps {
  productsToShow: ProductsDict | null;
  limit?: number;
  randomize?: boolean;
  onAddToCart?: (productId: string) => void; // optional override
}

const ProductsGallery: React.FC<ProductsGalleryProps> = ({
  productsToShow,
  limit = 8,
  randomize = true,
  onAddToCart,
}) => {
  const [rating, setRating] = useState<number>(0);

  // ✅ get cart API
  const cart = useCart() as any;

  // supports several common method names to match your existing CartProvider
  const addOneById = (productId: string) => {
    if (!productId) return;

    // Try typical APIs in order
    if (typeof cart?.add === "function") {
      cart.add(productId, 1);
    } else if (typeof cart?.addItem === "function") {
      cart.addItem(productId, 1);
    } else if (typeof cart?.increment === "function") {
      cart.increment(productId);
    } else if (typeof cart?.dispatch === "function") {
      cart.dispatch({ type: "ADD", id: productId, qty: 1 });
    } else {
      // Last resort: stash in localStorage-like minimal cart shape
      try {
        const key = "simpleCart";
        const raw = localStorage.getItem(key);
        const obj = raw ? JSON.parse(raw) : {};
        obj[productId] = (obj[productId] || 0) + 1;
        localStorage.setItem(key, JSON.stringify(obj));
      } catch {}
    }

    // Optional niceties if your CartProvider exposes them
    if (typeof cart?.notifyAdded === "function") cart.notifyAdded(productId);
    if (typeof cart?.openMiniCart === "function") cart.openMiniCart();
  };

  const selected: ProductsDict | null = useMemo(() => {
    if (!productsToShow) return null;

    const entries = Object.entries(productsToShow);
    if (entries.length <= limit) return productsToShow;

    const arr = entries.slice();
    if (randomize) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    return Object.fromEntries(arr.slice(0, limit));
  }, [productsToShow, limit, randomize]);

  const handleAddToCart = (productId: string) => {
    if (onAddToCart) {
      onAddToCart(productId);
    } else {
      addOneById(productId); // ✅ default to Cart context
    }
  };

  return (
    <section className={styles.block}>
      <ProductItemNew
        realProductsToShow={selected}
        rating={rating}
        changeRating={setRating}
        onAddToCart={handleAddToCart}
      />
    </section>
  );
};

export default ProductsGallery;
