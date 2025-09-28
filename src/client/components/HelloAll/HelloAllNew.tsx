import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import styles from "./HelloAllNew.module.scss";
import images from "../../data/images1";
import { getStringsList } from "../../services/emails";
import type { HereInterface } from "../../components/AdminArea/EditStrings/TableTypes";

// Helpers
function deepClone<T>(v: T): T {
  if (typeof structuredClone === "function") return structuredClone(v);
  return JSON.parse(JSON.stringify(v));
}
type GetStringsResponse<T> = { resultSent?: T };

const HelloAllNew: React.FC = () => {
  const [theObject, setObject] = useState<HereInterface | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const answer = (await getStringsList("categoriesList")) as GetStringsResponse<HereInterface>;
        if (!mounted) return;
        const raw = answer?.resultSent;
        if (raw == null) return setObject(null);
        setObject(deepClone(raw));
        // console.log("Answer resultSent:", raw);
      } catch (err) {
        console.error("Failed to load categoriesList:", err);
        if (mounted) setObject(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return <MediaItems list={theObject} />;
};

interface MediaProps {
  list: HereInterface | null;
}

const MediaItems: React.FC<MediaProps> = () => {
  return (
    <div className={styles.heroSectionMobileTabletLaptopParent}>
      {/* Desktop / Laptop */}
      <div className={styles.heroLaptopParent}>
        <div className={styles.heroSecParentContainer}>
          {/* remove gutters so layout matches the mock */}
          <Row className={`${styles.heroSectionDisplay} g-0`} style={{ margin: 0, padding: 0 }}>
            <Col xs={12} lg={6} className={styles.heroSecLeftContainerParent}>
              <div className={styles.heroSecLeftContainer}>
                <span className={styles.cherryImageContainer}>
                  <img width={200} src={images.cherry} alt="Cherry decoration" />
                </span>

                <p className={styles.heroSectionMainHeading}>
                  Află <br /> gama <br /> Din Munte
                </p>

                <p className={styles.heroSectionMainDesc}>
                  Descoperă produsele noastre parfumate și <br /> dă-ți voie la un moment de relaxare
                </p>

                <div className="d-flex gap-3">
                  <button className={styles.startShopHeroSec}>Start Shopping</button>
                  <button className={styles.seeMoreHeroSec}>Vezi mai mult</button>
                </div>
              </div>
            </Col>

            <Col xs={12} lg={6} className={styles.heroRightCol}>
              <div className={styles.heroImageWrap}>
                <img
                  src={images.heroSectionMainImage}
                  alt="Gama Din Munte"
                  loading="eager"
                  className={styles.heroImage}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Mobile / Tablet */}
      <div className={styles.heroMobileTabletParent}>
        <div className={styles.heroMobileSectionParent}>
          <Row className={styles.heroMobileDisplay}>
            <Col xs={12} className="d-flex justify-content-center">
              <img
                src={images.heroSectionMobileImage}
                alt="Gama Din Munte pe mobil"
                style={{ width: "90%", height: "auto" }}
                loading="lazy"
              />
            </Col>

            <Col xs={12}>
              <div className={styles.mobileHeroDescParent}>
                <p className={styles.mobileHeroDesc}>
                  Descoperă produsele noastre parfumate și dă-ți voie la un moment de relaxare
                </p>
              </div>
            </Col>

            <Col xs={12} className="d-flex align-items-center justify-content-center gap-2">
              <button className={styles.startShopHeroSecMobile}>Start Shopping</button>
              <button className={styles.seeMoreHeroSecMobile}>Vezi mai mult</button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default HelloAllNew;
