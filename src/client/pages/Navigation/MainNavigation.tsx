import React from "react";
import HelloAll from '../../components/HelloAll/HelloAll';
import ProductsGallery from '../../components/SuggestedProducts/ProductsGallery';
import FeaturedProduct from "../../components/FeaturedProduct/FeaturedProduct";
import BrandDetails from "../../components/Products/BrandDetails";

import { useProducts } from "../../components/hooks/hooks/useProducts";
import FeaturedText from '../../components/Products/FeaturedText';
import GrayBanner from '../../components/mini/HeadLiners/HeadLiners/GrayBanner';
import strings from './../../data/strings.json';
import featuredProducts from '../../data/featuredProducts.json';

const MainNavigation = () => {
  let { DiscoverOurProducts, GrayPromotion } = strings;
  const products = useProducts();

  return (
    <>
      <HelloAll />
      <FeaturedProduct content={featuredProducts.featuredProducts.firstSapun} />
      <BrandDetails />
      <FeaturedText text={DiscoverOurProducts} />
      <ProductsGallery productsToShow={products} />
      <GrayBanner text={GrayPromotion.text} />
    </>
  );
};

export default MainNavigation;
