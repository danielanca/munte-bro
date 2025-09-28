import React, { useEffect, useState } from "react";

import strings from "./../../data/strings.json";
import FeaturedProductNew from "../../components/FeaturedProduct/FeaturedProductNew";
import { ProductListType } from "../../utils/OrderInterfaces";
import { ProductsFromSessionStorage } from "../../data/constants";
import { getData } from "../../data/productList";
import ProductsGallery from "../../components/SuggestedProducts/ProductsGallery";
import FeaturedTextNew from "../../components/Products/FeaturedTextNew";
import GrayBanner from "../../components/mini/HeadLiners/HeadLiners/GrayBanner";
import HelloAllNew from "../../components/HelloAll/HelloAllNew";

const MainNavigation = () => {
  let {  GrayPromotion } = strings;

  const [products, setProducts] = useState<ProductListType[] | null>(null);
  let productsFromSession = sessionStorage.getItem(ProductsFromSessionStorage);

  useEffect(() => {
    if (productsFromSession != null) {
      setProducts(JSON.parse(productsFromSession));
    } else {
      getData().then(finalData => {
        setProducts(JSON.parse(JSON.stringify(finalData)));
      });
    }
  }, [productsFromSession]);

  return (
    <>
      <HelloAllNew />
      <FeaturedProductNew />
      <ProductsGallery productsToShow={products} />

      <FeaturedTextNew />
      <GrayBanner text={GrayPromotion.text} />
    </>
  );
};

export default MainNavigation;
