import React, { useState } from "react";
import styles from "./ProductsGallery.module.scss";
import ProductItemNew from "./ProductItemNew";

interface ProductsDict {
  [key: string]: any; // you can replace `any` with your ProductListItem later
}

interface ProductsGalleryProps {
  productsToShow: ProductsDict | null;
}

const ProductsGallery: React.FC<ProductsGalleryProps> = ({ productsToShow }) => {
  const [rating, setRating] = useState<number>(0);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    console.log("New rating:", newRating);
  };

  return (
    <div className={styles.blockContainer}>
      <ProductItemNew
        realProductsToShow={productsToShow}
        rating={rating}
        changeRating={handleRatingChange}
      />
    </div>
  );
};

export default ProductsGallery;
