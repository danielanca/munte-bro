import React from "react";
import { useRef, useState } from "react";
import NewsletterPop from './../../../../components/Newsletter/NewsletterPop'
import { useOutsideClicker } from './../../../../hooks/onScreen';
import styles from "./NewsletterBanner.module.scss";
import strings from '../../../../data/strings.json';

const NewsletterBanner = () => {
  const { NewsletterSection } = strings;
  const [newsletterPopModal, setNeModalletterPop] = useState<boolean>(false);
  const backdropRef = useRef(null);
  const backdropClose = () => {
    setNeModalletterPop(false);
  };
  useOutsideClicker(backdropRef, () => {
    backdropClose();
  });
  const openNewsletter = () => {
    setNeModalletterPop(true);
  };

  return (
    <div className={styles.newsletterBannerWrapper}>
      {newsletterPopModal && (
        <div ref={backdropRef} className={styles.backDrops}>
          <div className={styles.closePop} onClick={backdropClose}>
            X
          </div>
          <NewsletterPop />
        </div>
      )}
      <div className={styles.bannerWrapperInside}>
        <h3 className={styles.headTitle}>{NewsletterSection.title}</h3>
        <h4 className={styles.callToActtionMessage}>{NewsletterSection.subscribeCall}</h4>
        <button onClick={openNewsletter} className={styles.subscribeButtonBlack}>
          {NewsletterSection.subscribeMe}
        </button>
      </div>
    </div>
  );
};

export default React.memo(NewsletterBanner);
