/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import uniqueId from "lodash/uniqueId";
import Relaxbar from "../mini/Footers/Relaxbar";
import { footerData } from "./../../data/componentStrings";
import NewsletterBanner from "../mini/HeadLiners/HeadLiners/NewsletterBanner";
import allPathsURL from "./../../data/allPathsURL.json";
import styles from "./Footer.module.scss";
import images from "./../../data/images";

const Footer = () => {
  const { pathname } = useLocation();

  return (
    <>
      {!pathname.includes(allPathsURL.adminURL) && !pathname.includes(allPathsURL.loginURL) && (
        <div className={styles.fluidHandler}>
          {!pathname.includes(allPathsURL.cartPageURL) && !pathname.includes(allPathsURL.finishOrderURL) && (
            <>
              <Relaxbar />
              <NewsletterBanner />
            </>
          )}

          <div className={"row " + styles.largeFooter}>
            <div className="">
              <div className="row">
                <div className={"col " + styles.footItem}>
                  <h3 className={styles.footerTittleCenter}>{"LINK-URI UTILE"}</h3>
                  {Object.values(footerData.linkuriUtile).map(item => (
                    <a key={uniqueId()} href={item.link}>
                      <p className={styles.classicText}>{item.name}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="">
              <div className="row">
                <div className={"col " + styles.footItem}>
                  <h3 className={styles.footerTittleCenter}>{"DETALII COMERCIALE"}</h3>
                  {Object.values(footerData.companyData).map(item => (
                    <a key={uniqueId()}>
                      <p className={styles.classicText}>{item}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className=" ">
              <div className="row">
                <div className={"col " + styles.footItem}>
                  <h3 className={styles.footerTittleCenter}>{"MAGAZINUL NOSTRU"}</h3>
                  {Object.values(footerData.ourShop).map(item => (
                    <a key={uniqueId()} href={item.link}>
                      <p className={styles.classicText}>{item.name}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.anpcContainer}>
              <div className={styles.picsS}>
                <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="nofollow">
                  <img src={images.anpcSAL} alt="sal" />{" "}
                </a>
              </div>

              <div className={styles.picsS}>
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="nofollow">
                  <img src={images.anpcSOL} alt="sol" />{" "}
                </a>
              </div>
            </div>

            <div className={styles.wideBanner}>
              <p className={styles.statementRO}>{"Făcut cu ❤️ in Romania"}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
