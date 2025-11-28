import React, { useEffect, useState } from "react";
import styles from "./SuggestionArea.module.scss";
import { ProductsFromSessionStorage } from "../../data/constants";
import { HashLink } from "react-router-hash-link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface SuggestionProps {
  productID: string;
}

const SuggestionArea = ({ productID }: SuggestionProps) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ProductsFromSessionStorage);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const arr = Array.isArray(parsed) ? parsed : Object.values(parsed);
      const filtered = arr.filter((p: any) => p.ID !== productID);

      setProducts(filtered.slice(0, 6));
    } catch (e) {
      console.error("SuggestionArea error:", e);
    }
  }, [productID]);

  if (products.length === 0) return null;

  return (
    <div className={styles.suggestion__container}>
      <h3 className={styles.suggestion__title}>RECOMANDAT</h3>

      <Swiper
        className={styles.suggestion__swiper}
        modules={[Navigation]}
        navigation
        spaceBetween={10}
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
          1600: { slidesPerView: 4 },
        }}
      >
        {products.map((item: any) => {
          const img = item.imageProduct?.[0];

          return (
            <SwiperSlide key={item.ID} className={styles.suggestion__slide}>
              <HashLink to={`/produs/${item.ID}`} className={styles.suggestion__card}>
                <div className={styles.suggestion__imageWrap}>
                  {img ? (
                    <img src={img} alt={item.title} loading="lazy" />
                  ) : (
                    <div className={styles.suggestion__fallback}>Fără imagine</div>
                  )}
                </div>

                <div className={styles.suggestion__name}>{item.title}</div>

                <div className={styles.suggestion__price}>
                  {item.discountedPrice ? item.discountedPrice : item.price} Lei
                </div>
              </HashLink>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SuggestionArea;
