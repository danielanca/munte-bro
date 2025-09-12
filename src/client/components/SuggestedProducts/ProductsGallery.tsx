import React from "react";
import styles from "./ProductsGallery.module.scss";
import ProductItem from "../Products/ProductItem";
import uniqueId from "lodash/uniqueId";

interface ProductsGalleryProps {
  productsToShow: {};
}

const ProductsGallery = ({ productsToShow }: ProductsGalleryProps) => {
  return (
    <div className={styles.blockContainer}>
      <div className={styles.productList}>
        {productsToShow != null
          ? Object.values(productsToShow).map((item) => <ProductItem key={uniqueId()} productObject={item} />)
          : "loading data..."}
      </div>
    </div>
  );
};

export default ProductsGallery;
