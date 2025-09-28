import React from "react";
import { ReviewsInterface } from "../../utils/ReviewsTypes";
import { ProductListType,} from "../../utils/OrderInterfaces";
interface CommentsProps {
  reviewsList: any;
  productID: string;
  productData?: string;
}
const Comments = ({ productData,  productID }: CommentsProps) => {
  let productReviews: ReviewsInterface | null = null;
  const allReviews: any = [];

  if (productData != null) {
    productReviews = JSON.parse(productData)[productID].reviews;
    let allRevs: ProductListType = JSON.parse(productData);


  }

  return (
    <>
    <hr style={{ marginTop: "100px"}} />
      
    </>
  );
};

export default Comments;
