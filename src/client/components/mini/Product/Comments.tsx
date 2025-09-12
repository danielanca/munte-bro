import React, {useRef} from "react";
import ReviewField from "./ReviewField/ReviewField";
import styles from './Comments.module.scss';
import { ReviewsInterface } from "../../../utils/ReviewsTypes";
import { useSenseScreen } from "../../hooks/senseHook/useScrollSense";
import { ProductListType, ProductModel } from "../../../utils/OrderInterfaces";
import { sendTriggerEmail } from "../../../services/triggers";
interface CommentsProps {
  reviewsList: any;
  productID: string;
  productData?: string;
}
const Comments = ({ productData, reviewsList, productID }: CommentsProps) => {
  let productReviews: ReviewsInterface | null = null;
  const allReviews: any = [];
  const senseReviewContainer = useRef<HTMLDivElement | null>(null);

  useSenseScreen(senseReviewContainer, window.location.pathname, () => {
    if (senseReviewContainer.current) {
      console.log("User is viewing Reviews on ", window.location.pathname);
      sendTriggerEmail({ typeEvent: "REVIEWS_VIEW", url: window.location.pathname });
    }
  });

  if (productData != null) {
    productReviews = JSON.parse(productData)[productID].reviews;
    let allRevs: ProductListType = JSON.parse(productData);

    Object.values(allRevs).forEach((item) =>
      Object.values(item.reviews).length >= 1
        ? Object.values(item.reviews).forEach((item) => allReviews.push(item))
        : ""
    );
  }

  return (
    <>
      <div ref={senseReviewContainer} className={styles.descriptionContainer}>
        {productReviews != null ? (
          <ReviewField allReviews={allReviews} productData={productReviews} productIdentification={productID} />
        ) : (
          "NOTHING HERE - REVIEWS"
        )}
      </div>
    </>
  );
};

export default Comments;
