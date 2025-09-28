import React from "react";
import styles from "./ProductItemDetailsBannerNew.module.scss";

interface BannerItem {
  backgroundImage: string;
  bannerTitle: string;
  id?: string | number; // optional stable key if you have one
}

interface ProductItemDetailsBannerNewProps {
  banner?: BannerItem[] | null; // tolerate undefined/null
}

const ProductItemDetailsBannerNew: React.FC<ProductItemDetailsBannerNewProps> = ({ banner = [] }) => {
  if (!Array.isArray(banner) || banner.length === 0) return null;

  return (
    <div>
      {banner.map((data: BannerItem, idx: number) => (
        <div
          key={data.id ?? `${data.bannerTitle}-${idx}`}
          className={styles.ProductPageBanner}
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
          aria-label={data.bannerTitle}
        >
          <div className={styles.bannerHeading}>{data.bannerTitle}</div>
        </div>
      ))}
    </div>
  );
};

export default ProductItemDetailsBannerNew;
