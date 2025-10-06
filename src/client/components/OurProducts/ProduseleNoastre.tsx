// ProduseleNoastre.tsx
import React, { useEffect, useState } from "react";
import HelmetHead from "../MiniComponents/HelmetHead/HelmetHead";
import ProductItemDetailsNew from "./ProductItemDetailsNew";
import strings from "../../data/strings.json";
import { ProductsFromSessionStorage } from "../../data/constants";
import styles from "./ProduseleNoastre.module.scss";

// ⬇️ use Firestore service instead of getData()
import { listProducts } from "../../services/products";

// types
import type { ProductListType, ProductListArray } from "../../utils/OrderInterfaces";

const ProduseleNoastre = () => {
  const { ProduseleNoastre } = strings;

  // can be an object map (Record) or an array — keep union
  const [products, setProducts] = useState<ProductListType | ProductListArray | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(ProductsFromSessionStorage);
    if (cached) {
      try {
        setProducts(JSON.parse(cached));   // map or array
      } catch {
        // ignore parse errors and fetch fresh
      }
    }

    // Always fetch fresh from Firestore so a direct hit to /produse works
    (async () => {
      try {
        const fresh = await listProducts();              // -> Record<string, ProductModel>
        setProducts(fresh as unknown as ProductListType);
        sessionStorage.setItem(ProductsFromSessionStorage, JSON.stringify(fresh));
      } catch (e) {
        console.error("Failed to load products from Firestore:", e);
      }
    })();
  }, []);

  return (
    <>
      <HelmetHead
        title={ProduseleNoastre.title}
        description={ProduseleNoastre.metaDescription}
      />
      <div className={styles.blockContainer}>
        <div>
          <ProductItemDetailsNew productData={products} />
        </div>
      </div>
    </>
  );
};

export default ProduseleNoastre;
