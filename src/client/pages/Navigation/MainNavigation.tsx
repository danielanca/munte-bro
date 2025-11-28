// MainNavigation.tsx
import React, { useEffect, useState } from "react";
import strings from "./../../data/strings.json";
import FeaturedProductNew from "../../components/FeaturedProduct/FeaturedProductNew";
import { ProductsFromSessionStorage } from "../../data/constants";
import ProductsGallery from "../../components/SuggestedProducts/ProductsGallery";
import FeaturedTextNew from "../../components/Products/FeaturedTextNew";
import GrayBanner from "../../components/mini/HeadLiners/HeadLiners/GrayBanner";
import Contactinfo from "../../components/mini/HeadLiners/HeadLiners/Contactinfo";
import HelloAllNew from "../../components/HelloAll/HelloAllNew";

// ⬇️ use Firestore service
import { listProducts } from "../../services/products";
import type { ProductModel } from "../../utils/OrderInterfaces";

type ProductsDict = Record<string, ProductModel>;

const MainNavigation = () => {
  const { GrayPromotion } = strings;

  const [products, setProducts] = useState<ProductsDict | null>(null);

  useEffect(() => {
    // 1) try cache
    const cached = sessionStorage.getItem(ProductsFromSessionStorage);
    if (cached) {
      try {
        setProducts(JSON.parse(cached) as ProductsDict);
      } catch {}
    }

    // 2) fetch fresh from Firestore
    (async () => {
      try {
        const data = await listProducts();      // <-- pulls from Firestore "products"
        setProducts(data);
        sessionStorage.setItem(ProductsFromSessionStorage, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to load products:", e);
      }
    })();
  }, []);

  return (
    <>
      <HelloAllNew />
      <FeaturedProductNew />
<ProductsGallery productsToShow={products} limit={8} randomize />
      <FeaturedTextNew />
      <Contactinfo />
      <GrayBanner text={GrayPromotion.text} />
    </>
  );
};

export default MainNavigation;
