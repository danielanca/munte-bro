// ProductFilters.tsx
import React from "react";
import styles from "../OurProducts/ProductItemDetails.module.css";

export type PriceKey = "UNDER_50" | "P50_100" | "P200_250";

export interface ProductFiltersState {
  price: Set<PriceKey>;
  ratings: Set<number>;     // e.g. {4} or {5}
  producers: Set<string>;
}

interface FacetCounts {
  price?: Partial<Record<PriceKey, number>>;
  rating?: Partial<Record<number, number>>; // keys: 4,5
  producers?: Record<string, number>;
}

interface ProductFiltersProps {
  selected: ProductFiltersState;
  onTogglePrice: (key: PriceKey) => void;
  onToggleRating: (min: number) => void;      // 4 or 5
  onToggleProducer: (name: string) => void;
  producers: string[];                         // unique producers derived from items
  facetCounts?: FacetCounts;                   // optional, for dynamic counts
  onClearAll?: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  selected,
  onTogglePrice,
  onToggleRating,
  onToggleProducer,
  producers,
  facetCounts,
  onClearAll,
}) => {
  return (
    <aside className={styles.filtersSidebar}>
      <div className={styles.filtersHeaderRow}>
        <h2 className={styles.filtersTitle}>Filtre</h2>
        {onClearAll && (
          <button className={styles.clearFiltersBtn} onClick={onClearAll}>
            Reset
          </button>
        )}
      </div>

      {/* Price */}
      <div className={styles.filterSection}>
        <h3>Preț</h3>

        <div className={styles.filterOption}>
          <input
            type="checkbox"
            id="price-under-50"
            checked={selected.price.has("UNDER_50")}
            onChange={() => onTogglePrice("UNDER_50")}
          />
          <label htmlFor="price-under-50">
            Sub 50 Lei{facetCounts?.price?.UNDER_50 != null ? ` (${facetCounts?.price?.UNDER_50})` : ""}
          </label>
        </div>

        <div className={styles.filterOption}>
          <input
            type="checkbox"
            id="price-50-100"
            checked={selected.price.has("P50_100")}
            onChange={() => onTogglePrice("P50_100")}
          />
          <label htmlFor="price-50-100">
            50 – 100 Lei{facetCounts?.price?.P50_100 != null ? ` (${facetCounts?.price?.P50_100})` : ""}
          </label>
        </div>

        <div className={styles.filterOption}>
          <input
            type="checkbox"
            id="price-200-250"
            checked={selected.price.has("P200_250")}
            onChange={() => onTogglePrice("P200_250")}
          />
          <label htmlFor="price-200-250">
            200 – 250 Lei{facetCounts?.price?.P200_250 != null ? ` (${facetCounts?.price?.P200_250})` : ""}
          </label>
        </div>
      </div>

      {/* Rating */}
      <div className={styles.filterSection}>
        <h3>Rating</h3>
        <div className={styles.filterOption}>
          <input
            type="checkbox"
            id="rating-4"
            checked={selected.ratings.has(4)}
            onChange={() => onToggleRating(4)}
          />
          <label htmlFor="rating-4">
            Peste ★★★★☆{facetCounts?.rating?.[4] != null ? ` (${facetCounts?.rating?.[4]})` : ""}
          </label>
        </div>
        <div className={styles.filterOption}>
          <input
            type="checkbox"
            id="rating-5"
            checked={selected.ratings.has(5)}
            onChange={() => onToggleRating(5)}
          />
          <label htmlFor="rating-5">
            Peste ★★★★★{facetCounts?.rating?.[5] != null ? ` (${facetCounts?.rating?.[5]})` : ""}
          </label>
        </div>
      </div>

      {/* Producers */}
      <div className={styles.filterSection}>
        <h3>Producători</h3>
        {producers.length === 0 && <div className={styles.filterOptionMuted}>Niciun producător detectat</div>}
        {producers.map((name) => (
          <div key={name} className={styles.filterOption}>
            <input
              type="checkbox"
              id={`producer-${name}`}
              checked={selected.producers.has(name)}
              onChange={() => onToggleProducer(name)}
            />
            <label htmlFor={`producer-${name}`}>
              {name}
              {facetCounts?.producers?.[name] != null ? ` (${facetCounts?.producers?.[name]})` : ""}
            </label>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ProductFilters;
