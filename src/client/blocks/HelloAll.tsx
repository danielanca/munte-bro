// HelloAll.tsx
import React, { useEffect, useState } from "react";
import styles from "./HelloAll.module.scss";
import ElasticGallery from "./ElasticGallery";
import { getStringsList } from "../services/emails";
import stringify from "json-stable-stringify";

// Minimal shape that ElasticGallery needs
interface GalleryItem {
  name: string;
  link: string;
  image: string;
  text: string;
}
type GalleryMap = Record<string, GalleryItem>;

// API response type (adjust if your real API differs)
interface GetStringsResponse {
  resultSent: unknown; // we’ll validate/parse it
}

const HelloAll: React.FC = () => {
  const [galleryMap, setGalleryMap] = useState<GalleryMap | null>(null);

  useEffect(() => {
    const fetchFrontCategories = async () => {
      try {
        const answer = (await getStringsList("categoriesList")) as GetStringsResponse;

        // json-stable-stringify can return `string | undefined`
        const serialized = stringify(answer?.resultSent);
        if (typeof serialized === "string") {
          const parsed = JSON.parse(serialized) as GalleryMap;
          setGalleryMap(parsed);
          console.log("Answer is", answer.resultSent);
        } else {
          // nothing to parse
          setGalleryMap(null);
          console.warn("No categoriesList returned (undefined).");
        }
      } catch (e) {
        console.error("Failed to load categoriesList:", e);
        setGalleryMap(null);
      }
    };

    fetchFrontCategories();
  }, []);

  return <MediaItems list={galleryMap} />;
};

interface MediaProps {
  list: GalleryMap | null;
}

const MediaItems: React.FC<MediaProps> = ({ list }) => {
  console.log("Media Items:", list);
  return (
    <div className={styles.helloDarker}>
      <ElasticGallery galleryList={list ?? undefined} />
    </div>
  );
};

export default HelloAll;
