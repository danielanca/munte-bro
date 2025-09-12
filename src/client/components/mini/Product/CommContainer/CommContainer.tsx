import React from "react";
import styles from "./CommContainer.module.scss";
import { useRef } from "react";
import { useOutsideClicker } from "./../../../../components/hooks/hooks/useOutsideClicker";
import images from "../../../../data/images";

interface ReviewerInterface {
  reviewActual: string;
  date: string;
  name: string;
  starsNumber: string;
  email: string;
  reviewProductID: string;
  mediaLink?: string;
}

interface CommProps {
  containerHandler: React.Dispatch<React.SetStateAction<boolean>>;
  reviewItem: ReviewerInterface;
}

const CommContainer = ({ reviewItem, containerHandler }: CommProps) => {
  const backdropRef = useRef(null);

  useOutsideClicker(backdropRef, () => {
    containerHandler(false);
  });
  const onClosePop = () => containerHandler(false);

  return (
    <div className={styles.commCon}>
      <div ref={backdropRef} className={styles.commentBoard}>
        <div className={styles.itemComment}>
          <div className={styles.sideLeft}>
            <img onClick={onClosePop} className={styles.closeStyle} src={images.closeIcon} />

            <img className={styles.imageContainer} height={"100%"} src={reviewItem.mediaLink} />
          </div>
          <div className={styles.sideRight}>
            <div className={styles.authorStyle}>
              <div className={styles.authorContainer}>
                <div className={styles.authorLine}>
                  <p className={styles.name}>{reviewItem.name}</p>
                  <img className={styles.verifiedIcon} src={images.verifiedPurchase} />
                </div>
                <p className={styles.date}>{reviewItem.date}</p>
              </div>
              <div className={styles.reviewTextContainer}>
                <p className={styles.actualReviewStyle}>{reviewItem.reviewActual}</p>
              </div>
            </div>

            <div className={styles.footerComm}>
              <p className={styles.verifiedText}>{"Achizitie verificată"}</p>
              <img className={styles.verifiedIconSmall} src={images.verifiedPurchase} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommContainer;
