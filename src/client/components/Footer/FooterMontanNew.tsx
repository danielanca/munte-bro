import images from "../../data/images1";
import { Row, Col } from "reactstrap";
import { NavHashLink } from "react-router-hash-link";

// Old Data
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { uniqueId } from "lodash";

import styles from ".//FooterMontanNew.module.scss";
import strings from "../../data/strings.json";
import NewsletterBanner from "../MiniComponents/HeadLiners/NewsletterBanner";
import allPathsURL from "../../data/allPathsURL.json";

import { getStringsList } from "../../services/emails";
import { getType } from "../../components/AdminArea/EditStrings/TableTypes";

import LegalBanners from "../MiniComponents/LegalBanners";

const FooterMontanNew = () => {
  let { links, commercialData, ourShop, bottomMadeBy } = strings.footerText.headLines;
  const { pathname } = useLocation();
  const [footerFetch, setFooterFetch] = useState({});
  useEffect(() => {
    getStringsList("legalInfo").then((result: getType) => {
      setFooterFetch(JSON.parse(JSON.stringify(result.resultSent.legalData)));
    });
  }, []);

  // GoToTop function
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {!pathname.includes(allPathsURL.adminURL) && !pathname.includes(allPathsURL.loginURL) && (
        <div className={styles.fluidHandler}>
          {!pathname.includes(allPathsURL.cartPageURL) && (
            <>
              <NewsletterBanner />
            </>
          )}
          <div className={styles.footerParentContainer}>
            <Row className={styles.footerRowContainer} style={{ margin: 0 }}>
              <Col lg={5} xl={5} className={styles.footerLogoContainer}>
                <img src={images.FooterLogo} alt="" />
                <p className={styles.footerCopyrightText}>Copyright © 2023. LogoIpsum. All rights reserved.</p>
              </Col>
              <Col lg={2} xl={2} className={styles.footerSecondCol}>
                <p className={styles.footerPageLink}>
                  <NavHashLink className={styles.footerPageLinkText} to={"politica-confidentialitate-new"}>
                    Politica de Return
                  </NavHashLink>
                </p>
                <p className={styles.footerPageLink}>Email</p>
                <p className={styles.footerPageLink}>
                  <NavHashLink className={styles.footerPageLinkText} to={"termeni-confidentialitate"}>
                    Politica de Confidentialitate
                  </NavHashLink>
                </p>
              </Col>
              <Col xs={6} lg={2} xl={2} className={styles.footerThirdCol}>
                <p className={`${styles.footerPageLink} ${styles.politicaMobileFooter}`}>
                  <NavHashLink className={styles.footerPageLinkText} to={"politica-confidentialitate-new"}>
                    Politica de Return
                  </NavHashLink>
                </p>
                <p className={styles.footerPageLink}>
                  <NavHashLink className={styles.footerPageLinkText} to={"termeni-si-conditii"}>
                    Termeni si Conditii
                  </NavHashLink>
                </p>
                <p className={styles.footerPageLink}>ANPC</p>
                <p className={styles.footerPageLink}>Contact</p>
              </Col>
              <Col xs={4} lg={3} xl={3} className={styles.footerIconsCol}>
                <div className={styles.BackToTopIconParent}>
                  <img
                    src={images.BackToTopIcon}
                    alt="BackToTopIcon"
                    onClick={handleScrollToTop}
                    className={styles.BackToTopIcon}
                  />
                </div>
                <div className={styles.footerSocialMediaIcons}>
                  <img
                    src={images.FacebookIcon}
                    alt=""
                    className={styles.footerPageLink}
                    style={{ marginRight: "50px", height: "20px" }}
                  />
                  <img
                    src={images.InstagramIcon}
                    alt=""
                    className={styles.footerPageLink}
                    style={{ marginRight: "50px", height: "20px" }}
                  />
                  <img src={images.TwitterIcon} alt="" className={styles.footerPageLink} style={{ height: "20px" }} />
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.footerSocialMediaIconsMobile}>
            <img
              src={images.FacebookIcon}
              alt=""
              className={styles.footerPageLink}
              style={{ marginRight: "50px", height: "20px" }}
            />
            <img
              src={images.InstagramIcon}
              alt=""
              className={styles.footerPageLink}
              style={{ marginRight: "50px", height: "20px" }}
            />
            <img src={images.TwitterIcon} alt="" className={styles.footerPageLink} style={{ height: "20px" }} />
          </div>
        </div>
      )}
      <LegalBanners />
    </>
  );
};

export default FooterMontanNew;
