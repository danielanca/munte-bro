import React from "react";
import parse from "html-react-parser";
import styles from "./../ConstantComponents/DescriptionStyles.module.scss";
import { ProductListType } from '../../../utils/OrderInterfaces';
import RefundReturn from "./RefundReturn";
import cargusLogo from '../../../AdminDashboard/assets/images/CG_LOGO_OGB_RGB-1.svg'

interface ProductProps {
  productID: string;
  productDescription: ProductListType;
}

const ProductDescription = ({ productDescription, productID }: ProductProps) => {
  return (
    <>
      <div className={styles.helpContainer}>
        <img src="https://firebasestorage.googleapis.com/v0/b/diniubire-89ce0.appspot.com/o/icons%2Fdog.svg?alt=media&token=9671d8e4-d066-4554-bc15-d4a6e19583cc" />
        <p>
          {parse(
            `Cumpărând acest produs, oferim <strong>un bol de hrană</strong> animăluțelor de la <Br> <strong>Asociația “Andreea & Benji Happy Dogs”</strong>.`
          )}
        </p>
        <img src="https://firebasestorage.googleapis.com/v0/b/diniubire-89ce0.appspot.com/o/icons%2Fdog2.svg?alt=media&token=43dde796-490c-49be-bfa4-ee67d680e3ca" />
      </div>

      {/* New Logo Above Title */}
      <img 
        className={styles.logoAboveTitle} 
        src={cargusLogo } 
        alt="Cargus Logo" 
      />

      {/* Updated Title */}
      <h3 className={styles.title}>{"DETALII PRODUS"}</h3>

      <div className={styles.commentsArea}>
        <div className={styles.descriptionContainer}>
          <div className={styles.innerDescription}>
            {productDescription != null && parse(productDescription[productID].jsonContent)}
          </div>
        </div>
      </div>
      {productID && (productID === "mulaj-cuplu" || productID === "mulaj-familie") && <RefundReturn />}
    </>
  );
};

export default ProductDescription;
