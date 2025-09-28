// ProduseleNoastre.tsx
import React, { useEffect, useState } from "react";
import HelmetHead from "../MiniComponents/HelmetHead/HelmetHead";
import ProductItemDetailsNew from "./ProductItemDetailsNew";
import strings from "../../data/strings.json";
import { getData } from "../../data/productList";
import { ProductsFromSessionStorage } from "../../data/constants";
import styles from "./ProduseleNoastre.module.scss";

// import your types
import type { ProductListType, ProductListArray } from "../../utils/OrderInterfaces";

const ProduseleNoastre = () => {
  const { ProduseleNoastre } = strings;

  // Allow both shapes: array or map
  const [products, setProducts] = useState<ProductListType | ProductListArray | null>(null);

  useEffect(() => {
    const fromSession = sessionStorage.getItem(ProductsFromSessionStorage);
    if (fromSession) {
      setProducts(JSON.parse(fromSession)); // could be array or map
    } else {
      getData().then((finalData) => {
        // getData() often returns a map; keep as-is
        setProducts(finalData as ProductListType);
      });
    }
    // NOTE: don’t put fromSession in deps; you only want to run this on mount
  }, []);

  return (
    <>
      <HelmetHead title={ProduseleNoastre.title} description={ProduseleNoastre.metaDescription} />
      <div className={styles.blockContainer}>
        <div>
          <ProductItemDetailsNew productData={products} />
        </div>
      </div>
    </>
  );
};

export default ProduseleNoastre;
