import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import styles from "./HelloAllNew.module.scss";
// If HereInterface is the expected shape of `resultSent`, keep it.
// Otherwise, widen to `Record<string, unknown>` or your own type.
import type { HereInterface } from "../components/AdminArea/EditStrings/TableTypes";
import { getStringsList } from "../services/emails";
import images from "../data/images1";

const HelloAllNew: React.FC = () => {
  const [theObject, setObject] = useState<HereInterface | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const answer = await getStringsList("categoriesList"); // type: { resultSent?: unknown }
        const payload = (answer as { resultSent?: unknown })?.resultSent;

        // Only set when it’s an object; otherwise keep null
        if (payload && typeof payload === "object") {
          setObject(payload as HereInterface);
        } else {
          setObject(null);
        }
      } catch (e) {
        console.error("Failed to fetch categoriesList", e);
        setObject(null);
      }
    })();
  }, []);

  return <MediaItems list={theObject} />;
};

interface MediaProps {
  list: HereInterface | null;
}

const MediaItems: React.FC<MediaProps> = ({ list }) => {
  console.log("Media Items:", list);
  return (
    <div className={styles.heroSectionMobileTabletLaptopParent}>
      <div className={styles.heroLaptopParent}>
        <div className={styles.heroSecParentContainer}>
          <Row className={styles.heroSectionDisplay} style={{ margin: 0, padding: 0 }}>
            <Col xs={12} lg={6} className={styles.heroSecLeftContainerParent}>
              <div className={styles.heroSecLeftContainer}>
                <span className={styles.cherryImageContainer}>
                  <img width={200} src={images.cherry} alt="" />
                </span>
                <p className={styles.heroSectionMainHeading}>
                  Afla <br /> gama <br /> Din Munte
                </p>
                <p className={styles.heroSectionMainDesc}>
                  Descopera produseele noastre parmumate si <br /> da-ti voie la un moment de relaxare
                </p>
                <div className="d-flex">
                  <button className={styles.startShopHeroSec}>Start Shopping</button>
                  <button className={styles.seeMoreHeroSec}>Vezi mai mult</button>
                </div>
              </div>
            </Col>

            <Col xs={12} lg={6}>
              <img src={images.heroSectionMainImage} alt="" style={{ width: "90%" }} />
            </Col>
          </Row>
        </div>
      </div>

      <div className={styles.heroMobileTabletParent}>
        <div className={styles.heroMobileSectionParent}>
          <Row className={styles.heroMobileDisplay}>
            <Col xs={12} />
            <img src={images.heroSectionMobileImage} alt="" style={{ width: "90%" }} />
            <div className={styles.mobileHeroDescParent}>
              <p className={styles.mobileHeroDesc}>
                Descopera produseele noastre parmumate si da-ti voie la un moment de relaxare
              </p>
            </div>
            <div className="d-flex items-content-center justify-content-center">
              <button className={styles.startShopHeroSecMobile}>Start Shopping</button>
              <button className={styles.seeMoreHeroSecMobile}>Vezi mai mult</button>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default HelloAllNew;
