import React, { useEffect, useState } from "react";
import styles from "./Banner.module.scss";
import images from "../../../data/images";

interface BannerProps {
  onClick: () => void;
  discountApplied: boolean;
}

const Banner: React.FC<BannerProps> = ({ onClick, discountApplied }) => {
  const [timeLeft, setTimeLeft] = useState<number>(2 * 60 * 60);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timeLeft);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (timeLeft <= 0) return null;

  const handleClick = () => {
    onClick();
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className={styles.sectionBanner}>
      {discountApplied && showMessage ? (
        <div className={styles.banner}>Discount has been applied!</div>
      ) : (
        <div className={styles.banner}>
          <div className={styles.bannerWrapper}>
            <div className={styles.imagesBanner}>
              <img src={images.easyB} alt="easyB" />
              <img src={images.cargus} alt="cargus" />
            </div>
            <div className={styles.textBanner}>
              <div className={styles.freeText}>
                Exclusive for <br />
                <span>First-Time User</span>
              </div>
              <div className={styles.blackText}>Enjoy free Delivery !!</div>
              <div className={styles.codeSection} onClick={handleClick}>
                CODE : <span>TRANSPORT</span>FREE
              </div>
            </div>
          </div>
          <div className={styles.timeSection}>Offer expires in: {formatTime(timeLeft)}</div>
        </div>
      )}
    </div>
  );
};

export default Banner;
