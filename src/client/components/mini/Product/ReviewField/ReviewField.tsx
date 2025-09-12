import React from "react";
import uniqueId from "lodash/uniqueId";
import ReviewCard from "./../ReviewCard/ReviewCard";

import AddReview from "./../AddReview/AddReview";
import styles from "./ReviewField.module.scss";
import { ReviewsProps } from "../../../../utils/ReviewsTypes";

const ReviewField = ({ productData, productIdentification, allReviews }: ReviewsProps) => {
  let reviewsList = Object.values(productData);

  return (
    <div className={styles.contain}>
      {
        // productData != null && reviewsList.length >= 2 ? (
        //   <div className={styles.reviewContainer}>
        //     {reviewsList.map((item) => (
        //       <ReviewCard key={uniqueId()} testimonials={item} />
        //     ))}
        //   </div>
        // ) :
        productData != null && allReviews.length >= 1 ? (
          <div className={styles.reviewContainer}>
            {allReviews.map((item:any) => (
              <ReviewCard key={uniqueId()} testimonials={item} />
            ))}
          </div>
        ) : (
          <div className={styles.noReviewsComponent}>
            <h2>{"Nu exista recenzii"}</h2>
          </div>
        )
      }

      <AddReview productID={productIdentification} />
    </div>
  );
};

export default ReviewField;
