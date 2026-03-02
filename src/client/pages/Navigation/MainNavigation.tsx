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

import ImageGrid from "../../components/Banner/ImageGrid";

// ⬇️ use Firestore service
import { listProducts } from "../../services/products";
import type { ProductModel } from "../../utils/OrderInterfaces";

const imagesTop = [
  { 
    src: 'https://gomagcdn.ro/domains2/dinmunte.ro/files/banner/sare-de-baie-jpg5234.png',
     alt: '',
     name: 'Sare De Baie',
     link: "/produsele-noastre?section=sare"
     },
    { 
    src: 'https://gomagcdn.ro/domains2/dinmunte.ro/files/banner/sare-de-masa2935.png', 
    alt: '',
    name: 'Sare Neoidata si fara Antaglomerant',
    link: "/produsele-noastre?section=sare"
    },
];

const imagesBottom = [
  { 
    src: 'https://gomagcdn.ro/domains2/dinmunte.ro/files/banner/siropuri-c1-mbit-460x300-1mb-exact3933.jpg',
    alt: '',
    name: 'Siro Puri',
    link: "/produsele-noastre?section=sirop"
   },
  { 
    src: 'https://gomagcdn.ro/domains2/dinmunte.ro/files/banner/template-ai-sapun5287_1760595643.jpg', 
    alt: '', 
    name: 'Sapunuri',
    link: "/produsele-noastre?section=sapunuri"
    },
  { 
    src: 'https://gomagcdn.ro/domains2/dinmunte.ro/files/banner/template-ai-bath-bomb5962_1760595659.jpg',
    alt: '',
    name: 'Bombe de baie si Scrub',
    link: "/produsele-noastre?section=sapunuri"
 },
];

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
          <ImageGrid topRow={imagesTop} bottomRow={imagesBottom} />
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
