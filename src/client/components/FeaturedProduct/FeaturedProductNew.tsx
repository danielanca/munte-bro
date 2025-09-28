import React from "react";
import styles from "./FeaturedProductNew.module.scss";
import images from "../../data/images1";

function FeaturedProductNew() {
  return (
    <div className={styles.FeaturedNewParentContainer}>
      <div className={styles.FeaturedNewContainer}>
        <div className={styles.featuredProductLeftSideEffect}>
          <img src={images.FeaturedProductSideEffects} alt="" />
        </div>
        <div className={styles.productsContainer}>
          <div className={styles.product1Container}>
            <div className={styles.product1TextContainer}>
              <div className={styles.product1NameContainer}>
                <h2 className={styles.productTitle}>SAPUN</h2>
                <h5 className={styles.productSubTitle}>Sapun Lavanda</h5>
                <p className={styles.productMaterial}>100% Bomba Natural</p>
              </div>
              <div className={styles.product1MidBorder}></div>
              <div className={styles.product1PriceContainer}>
                <h4 className={styles.productPrice}>12.00 LEI </h4>
                <span className={styles.productSubmaterial}> (including VAT)</span>
              </div>
            </div>
            <div className={styles.product1ImageContainer}>
              <img className={styles.product1Image} src={images.FeaturedProductSapun1} alt="" />
            </div>
          </div>
          <div className={styles.product1Container}>
            <div className={styles.product1TextContainer}>
              <div className={styles.product1NameContainer}>
                <h2 className={styles.productTitle}>SAPUN</h2>
                <h5 className={styles.productSubTitle}>Sapun Lavanda</h5>
                <p className={styles.productMaterial}>100% Bomba Natural</p>
              </div>
              <div className={styles.product1MidBorder}></div>
              <div className={styles.product1PriceContainer}>
                <h4 className={styles.productPrice}>12.00 LEI </h4>
                <span className={styles.productSubmaterial}> (including VAT)</span>
              </div>
            </div>
            <div className={styles.product1ImageContainer}>
              <img className={styles.product2Image} src={images.FeaturedProductSapun2} alt="" />
            </div>
          </div>
        </div>
        <div className={styles.featuredProductRightSideEffect}>
          <img src={images.FeaturedProductSideEffects} alt="" width={55} />
        </div>
        <div className={styles.featuredProductCeleMaiPopulareContainer}>
          <div className={styles.featuredProductCeleMaiPopulare}>
            <div className={styles.CeleMaiPopulareHeadingContainer}>
              <h1 className={styles.CeleMaiPopulareHeading}>Cele mai populare</h1>
            </div>
            <div className={styles.featuredProductCeleMaiPopulareImageContainer}>
              <img
                className={styles.featuredProductCeleMaiPopulareImage}
                src={images.FeaturedProductCeleMaiPopulare}
                alt=""
              />
            </div>
          </div>
          <div className={styles.celeMaiPopulareDesc}>
            <p>{"sănătatea și îngrijirea pielii."}</p>
          </div>
        </div>
        <div className={styles.scrollDownContainer}>
          <div className={styles.scrollDownText}>
            <p>{"Mergi în jos"}</p>
          </div>
          <img src={images.ScrollArrowDown} alt="" />
        </div>
      </div>
    </div>
  );
}

export default FeaturedProductNew;
