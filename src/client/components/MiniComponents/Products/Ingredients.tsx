import React from "react";
import parse from "html-react-parser";
import styles from "./Ingredients.module.scss";

interface Proper {
  contentIngredients: {
    [key: string]: {
      title: string;
      text: string;
      image: string;
    };
  };
}
const Ingredients = ({ contentIngredients }: Proper) => {
  return (
    <div className={styles.ingredientsContainer}>
      {Object.values(contentIngredients).map((item, index: number) => (
        <div key={index} className={styles.productList}>
          <div className={styles.imageWrap}>
            <img className={styles.iconImage} src={item.image} />
          </div>

          <div className={styles.textArea}>
            <div className={styles.titleWrap}>
              <p className={styles.titleText}>{item.title}</p>
            </div>
            <div className={styles.textWrap}>
              <p>{parse(item.text)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ingredients;
