import React, { useEffect, useMemo, useState } from "react";
import { HashLink } from "react-router-hash-link";
import ReactStarRatings from "react-star-ratings";
import styles from "./ProductItemDetails.module.css";
import strings from "../../data/strings.json";
import type { ProductListItem, ProductListArray, ProductListType } from "../../utils/OrderInterfaces";
import ProductFilters, { PriceKey, ProductFiltersState } from "../SuggestedProducts/ProductFilters";

type ProductDataIn = ProductListArray | ProductListType | null | undefined;
type SortBy = "popular" | "price_asc" | "price_desc" | "newest";

interface ProductItemDetailsNewProps {
  productData: ProductDataIn;
}

const ProductItemDetailsNew: React.FC<ProductItemDetailsNewProps> = ({ productData }) => {
  const { ProductItem: ProductItemStrings } = strings as any;

  /** Normalize to flat array */
  const items: ProductListItem[] = useMemo(() => {
    if (!productData) return [];
    return Array.isArray(productData) ? productData : (Object.values(productData) as ProductListItem[]);
  }, [productData]);

  /** UI: back-to-top + responsive star size (unchanged) */
  const gotoElement = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [starSize, setStarSize] = useState(18);
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setStarSize(w <= 576 ? 12 : w <= 920 ? 16 : 18);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** Helpers */
  const isNewProduct = (createdAt: any): boolean => {
    if (!createdAt) return false;
    try {
      let createdDate: Date;
      if (createdAt instanceof Date) createdDate = createdAt;
      else if ((createdAt as any).seconds) createdDate = new Date((createdAt as any).seconds * 1000);
      else if (typeof createdAt === "string") createdDate = new Date(createdAt);
      else return false;

      const diffDays = Math.ceil(Math.abs(Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    } catch {
      return false;
    }
  };

  const parseNum = (v: string | number | undefined | null) => {
    if (v == null || v === "") return NaN;
    if (typeof v === "number") return v;
    const num = parseFloat(v.replace(",", "."));
    return Number.isFinite(num) ? num : NaN;
  };

  const hasDiscount = (price: string | number, discountedPrice?: string | number): boolean => {
    const p = parseNum(price);
    const d = parseNum(discountedPrice as any);
    return Number.isFinite(p) && Number.isFinite(d) && d < p;
  };

  const effectivePrice = (item: ProductListItem): number => {
    const p = parseNum(item.price as any);
    const d = parseNum((item as any).discountedPrice);
    if (Number.isFinite(d) && d > 0 && d < p) return d;
    return p;
  };

  const formatPrice = (price: string | number): string => {
    if (typeof price === "number") return price.toFixed(2).replace(".", ",");
    return price;
  };

  const calculateDiscountPercentage = (price: string | number, discountedPrice: string | number): string => {
    const p = parseNum(price);
    const d = parseNum(discountedPrice);
    if (!Number.isFinite(p) || !Number.isFinite(d) || p <= 0) return "-0%";
    return `-${Math.round(((p - d) / p) * 100)}%`;
  };

  const getRating = (item: ProductListItem): number => {
    // Try common fields in your models; fallback to 0 if missing
    const r =
      (item as any).avgRating ??
      (item as any).averageRating ??
      (item as any).rating ??
      (item as any).stars ??
      0;
    const n = Number(r);
    return Number.isFinite(n) ? n : 0;
  };

  const getProducer = (item: ProductListItem): string => {
    const p =
      (item as any).producer ??
      (item as any).brand ??
      (item as any).vendor ??
      (item as any).manufacturer ??
      "";
    return typeof p === "string" ? p.trim() : "";
  };

  /** ---- FILTERING STATE ---- */
  const [filters, setFilters] = useState<ProductFiltersState>({
    price: new Set<PriceKey>(),
    ratings: new Set<number>(),
    producers: new Set<string>(),
  });

  const [sortBy, setSortBy] = useState<SortBy>("popular");

  const toggleSet = <T,>(prev: Set<T>, val: T): Set<T> => {
    const next = new Set(prev);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
    // Important: always return a *new* Set to trigger re-render
  };

  const onTogglePrice = (key: PriceKey) =>
    setFilters((f) => ({ ...f, price: toggleSet(f.price, key) }));

  const onToggleRating = (min: number) =>
    setFilters((f) => ({ ...f, ratings: toggleSet(f.ratings, min) }));

  const onToggleProducer = (name: string) =>
    setFilters((f) => ({ ...f, producers: toggleSet(f.producers, name) }));

  const clearAll = () =>
    setFilters({ price: new Set(), ratings: new Set(), producers: new Set() });

  /** Unique producers for the facet list */
  const allProducers = useMemo(() => {
    const s = new Set<string>();
    items.forEach((it) => {
      const p = getProducer(it);
      if (p) s.add(p);
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [items]);

  /** Basic facet counts (optional, from all items) */
  const facetCounts = useMemo(() => {
    const price: Record<PriceKey, number> = { UNDER_50: 0, P50_100: 0, P200_250: 0 };
    const rating: Record<number, number> = { 4: 0, 5: 0 };
    const producers: Record<string, number> = {};

    for (const it of items) {
      const ep = effectivePrice(it);

      if (ep < 50) price.UNDER_50++;
      if (ep >= 50 && ep <= 100) price.P50_100++;
      if (ep >= 200 && ep <= 250) price.P200_250++;

      const r = getRating(it);
      if (r >= 4) rating[4]++;
      if (r >= 5) rating[5]++;

      const p = getProducer(it);
      if (p) producers[p] = (producers[p] ?? 0) + 1;
    }

    return { price, rating, producers };
  }, [items]);

  /** Filtering */
  const filtered = useMemo(() => {
    if (!items.length) return [];

    const priceMatch = (price: number) => {
      if (filters.price.size === 0) return true;
      let ok = false;
      if (filters.price.has("UNDER_50") && price < 50) ok = true;
      if (filters.price.has("P50_100") && price >= 50 && price <= 100) ok = true;
      if (filters.price.has("P200_250") && price >= 200 && price <= 250) ok = true;
      return ok;
    };

    const minRating = filters.ratings.size ? Math.max(...Array.from(filters.ratings)) : 0;

    return items.filter((it) => {
      const price = effectivePrice(it);
      if (!Number.isFinite(price)) return false;

      if (!priceMatch(price)) return false;

      const r = getRating(it);
      if (minRating > 0 && r < minRating) return false;

      if (filters.producers.size > 0) {
        const p = getProducer(it);
        if (!p || !filters.producers.has(p)) return false;
      }

      return true;
    });
  }, [items, filters]);

  /** Sorting */
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case "price_asc":
        arr.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case "price_desc":
        arr.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      case "newest":
        arr.sort((a, b) => {
          const da =
            (a as any).createdAt?.seconds
              ? new Date((a as any).createdAt.seconds * 1000).getTime()
              : new Date((a as any).createdAt ?? 0).getTime();
          const db =
            (b as any).createdAt?.seconds
              ? new Date((b as any).createdAt.seconds * 1000).getTime()
              : new Date((b as any).createdAt ?? 0).getTime();
          return db - da; // newest first
        });
        break;
      case "popular":
      default:
        // Keep original order (or you can add popularity logic if you have it)
        break;
    }
    return arr;
  }, [filtered, sortBy]);

  /** Empty state */
  if (items.length === 0) {
    return <div className={styles.empty}>Momentan nu avem produse. Vă rugăm să încercați din nou în câteva minute.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {/* Filters Sidebar - controlled */}
      <ProductFilters
        selected={filters}
        onTogglePrice={onTogglePrice}
        onToggleRating={onToggleRating}
        onToggleProducer={onToggleProducer}
        producers={allProducers}
        facetCounts={facetCounts}
        onClearAll={clearAll}
      />

      {/* Products Section */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <div className={styles.productsCount}>
            Afișează: 1-{sorted.length} din {sorted.length} produse
          </div>
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(
              e.target.value as SortBy
            )}
          >
            <option value="popular">Cele mai cumparate</option>
            <option value="price_asc">Pret crescator</option>
            <option value="price_desc">Pret descrescator</option>
            <option value="newest">Cele mai noi</option>
          </select>
        </div>

        <div className={styles.productsGrid}>
          {sorted.map((item) => {
            const img = (item as any).imageProduct?.[0];
            const isNew = isNewProduct((item as any).createdAt);
            const disc = hasDiscount((item as any).price, (item as any).discountedPrice);
            const displayPrice = disc
              ? formatPrice((item as any).discountedPrice)
              : formatPrice((item as any).price);
            const originalPrice = disc ? formatPrice((item as any).price) : null;

            return (
              <div key={item.ID} className={styles.productCard}>
                {(isNew || disc) && (
                  <div className={styles.badgeContainer}>
                    {isNew && <div className={`${styles.badge} ${styles.badgeNew}`}>Nou</div>}
                    {disc && (item as any).discountedPrice && (
                      <div className={`${styles.badge} ${styles.badgeDiscount}`}>
                        {calculateDiscountPercentage((item as any).price, (item as any).discountedPrice)}
                      </div>
                    )}
                  </div>
                )}

                <HashLink onClick={gotoElement} to={`/produs/${item.ID}`} className={styles.HashLinkStyle}>
                  <div className={styles.media}>
                    {img ? (
                      <img src={img} alt={(item as any).title} className={styles.productImage} loading="lazy" />
                    ) : (
                      <div className={styles.imageFallback}>Fără imagine</div>
                    )}
                  </div>

                  <h3 className={styles.productTitle}>
                    <span className={styles.titleText}>{(item as any).title}</span>
                  </h3>

                  <div className={styles.reviewStarRatings}>
                    <div className={styles.stars}>
                      <ReactStarRatings
                        rating={getRating(item) || 0}
                        starRatedColor="#3A5A40"
                        starHoverColor="#3A5A40"
                        starDimension={`${starSize}px`}
                        starSpacing="2px"
                        numberOfStars={5}
                        name="rating"
                      />
                    </div>
                    <div className={styles.productTotalReviews}>{(item as any).productTotalReviews ?? 0}</div>
                  </div>

                  <div className={styles.priceSection}>
                    <div className={styles.priceContainer}>
                      <span className={styles.currentPrice}>{displayPrice} Lei</span>
                      {originalPrice && <span className={styles.originalPrice}>{originalPrice} Lei</span>}
                    </div>
                    <span className={styles.priceUnit}>/ Bucată</span>
                  </div>
                </HashLink>

                <button
                  className={styles.addToCartBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Add to cart:", item.ID);
                  }}
                >
                  Adaugă în Coș
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ProductItemDetailsNew;
