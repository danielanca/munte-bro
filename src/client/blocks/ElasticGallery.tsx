import React, { useEffect, useState } from "react";
import { NavHashLink } from "react-router-hash-link";

import styles from "./ElasticGallery.module.scss";
import skeleton from "../components/MiniComponents/LoadingSkeleton/LoadingSkeleton.module.scss";

// A single gallery item
interface GalleryItem {
  name: string;
  link: string;
  image: string;
  text: string;
}

// The JSON shape you showed (object map: { key: GalleryItem })
export type GalleryMap = Record<string, GalleryItem>;

// Props for this component (use this instead of HereInterface)
interface GalleryProps {
  galleryList: GalleryMap | null | undefined;
}

const ElasticGallery: React.FC<GalleryProps> = ({ galleryList }) => {
  // If you don't need the event, don't take it—removes the TS7006 entirely
  const goToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const [categoriesList, setCategoriesList] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    if (galleryList && typeof galleryList === "object") {
      setCategoriesList(Object.values(galleryList));
    } else {
      setCategoriesList(null);
    }
  }, [galleryList]);

  return (
    <div className={styles.cards}>
      {!categoriesList ? (
        <>
          <div className={skeleton.cardSkeletonLine}>
            <div className={skeleton.isloading} />
          </div>
          <div className={skeleton.cardTest}>
            <div className={skeleton.isloading} />
          </div>
        </>
      ) : (
        categoriesList.map((item, index) => (
          <div
            key={`${item.link}-${index}`}
            className={styles.cardItem}
            style={{
              backgroundImage: `linear-gradient(rgb(255 255 255 / 0%), rgb(0 0 0 / 17%)), url(${item.image})`,
            }}
          >
            {/* Full-card link overlay */}
            <NavHashLink
              className={styles.inheritAll}
              onClick={goToTop}
              to={`/produs/${item.link}`}
              aria-label={item.name}
            />
            <h2 className={styles.headline}>{item.name}</h2>
          </div>
        ))
      )}
    </div>
  );
};

export default ElasticGallery;
