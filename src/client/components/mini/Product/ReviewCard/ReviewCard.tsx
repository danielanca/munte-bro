import React, { useState } from "react";
import StarDisplayer from "../StarDisplay/StarDisplayer";
import styles from "./ReviewCard.module.scss";
import images from '../../../../data/images';
import CommContainer from "../CommContainer/CommContainer";
interface ReviewerInterface {
  reviewActual: string;
  date: string;
  name: string;
  starsNumber: string;
  email: string;
  reviewProductID: string;
  mediaLink?: string;
}
interface IProps {
  testimonials: ReviewerInterface;
}
//https://extensions.dev/extensions/firebase/storage-resize-images
//Image processing for media upload
const ReviewCard = ({ testimonials }: IProps) => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const openComment = () => {
    setisOpen(true);
  };

  return (
    <>
      {isOpen && testimonials.hasOwnProperty("mediaLink") && (
        <CommContainer reviewItem={testimonials} containerHandler={setisOpen} />
      )}
      <div className={styles.commentBoard}>
        <div className={styles.rowInside}>
          <div className={styles.colItem}>
            <div className={styles.authorStyle}>
              <div className={styles.authorLine}>
                <p className={styles.name}>{testimonials.name}</p>
                <img className={styles.verifiedIcon} src={images.verifiedPurchase} />
              </div>

              <p className={styles.date}>{testimonials.date}</p>
            </div>
            <div className={styles.reviewStars}>
              <StarDisplayer starScore={testimonials.starsNumber} />
            </div>
            <div className={styles.comment}>
              <p className={styles.actualComment}>{testimonials.reviewActual}</p>
            </div>
          </div>
          {testimonials.hasOwnProperty("mediaLink") && (
            <div onClick={openComment} className={styles.colItemRight}>
              <img className={styles.mediaRight} src={testimonials.mediaLink} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ReviewCard;
