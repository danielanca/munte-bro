import React, { useEffect, useLayoutEffect } from "react";
import styles from "./TopBanner.module.scss";
import images from "../../data/images1";
import parse from "html-react-parser";
import { websiteContact, TopBannerPromotional } from "../../data/componentStrings";

// SSR-safe layout effect
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useContainerWidth(id: string) {
  const [width, setWidth] = React.useState<number>(0);
  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    const update = () => setWidth(el?.clientWidth ?? 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [id]);
  return width;
}

// Optional: responsive font helper (kept from your version, but safer defaults)
function fontByTextAndWidth(text: string, width: number) {
  // Base font size for desktop; clamp for extremes
  if (!width || text.length === 0) return undefined;
  const target = Math.max(12, Math.min(18, width / Math.max(20, text.length / 1.6)));
  return { fontSize: `${Math.round(target)}px` };
}

const TopBanner: React.FC = () => {
  const width = useContainerWidth("topBannerCenter");

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Top banner width:", width);
  }, [width]);

  return (
    <div className={styles.bigBlanaBannerParentContainer} role="region" aria-label="Top announcement">
      <div className={styles.bigBlanaBannerContainer}>
        {/* Left: email */}
        <div className={styles.emailTop}>{websiteContact.email}</div>

        {/* Center: message (true center regardless of left/right width) */}
        <div id="topBannerCenter" className={styles.topBannerText}>
          <p
            className={styles.topbannerheadTitle}
            style={fontByTextAndWidth(TopBannerPromotional.text, width)}
          >
            {parse(TopBannerPromotional.text)}
          </p>
        </div>

        {/* Right: socials */}
        <div className={styles.socialsTop}>
          <a href={websiteContact.socials.instagram} aria-label="Instagram" className={styles.iconWrapper}>
            <img alt="" className={styles.iconStyle} src={images.socialIcons.instagram} />
          </a>
          <a href={websiteContact.socials.whatsapp} aria-label="WhatsApp" className={styles.iconWrapper}>
            <img alt="" className={styles.iconStyle} src={images.socialIcons.whatsapp} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
