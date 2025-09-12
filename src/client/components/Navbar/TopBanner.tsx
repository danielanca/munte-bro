import React, { useEffect, useLayoutEffect } from "react";
import styles from './TopBanner.module.scss'
import images from './../../data/images';
import parse from "html-react-parser";
import { websiteContact, TopBannerPromotional } from "../../data/componentStrings";


const TopBanner = () => {
  const useGetContainerDimensions = (ID: string) => {
    const [size, setSize] = React.useState<number[]>([15, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        let width = document.getElementById(ID)?.clientWidth;
        let height = document.getElementById(ID)?.clientHeight;
        if (width && height) {
          setSize([width, height]);
        }
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  };

  const [bannerSize] = useGetContainerDimensions("topBannerCol");

  const getFontSizeByTextLength = (text: string, width: number) => {
    let fontSize = 12;
    if (width > 50 && text.length < 150) {
      fontSize = width / (text.length / 1.57) > 12 ? width / (text.length / 1.47) : 12;
      fontSize = fontSize > 20 ? 20 : fontSize;
    } else {
      fontSize = 20;
    }
    return { fontSize: fontSize + "px" };
  };

  return (
    <div className={styles.bigBlanaBanner}>
      <div className={styles.emailTop}>{""}</div>
      <div id="topBannerCol" className="col-md-6 ">
        {/* <p style={computeResponsiveFont(bannerSize, 10, 25)} className={styles.headTitle}> */}
        <p style={getFontSizeByTextLength(TopBannerPromotional.text, bannerSize)} className={styles.headTitle}>
          {parse(TopBannerPromotional.text)}
        </p>
      </div>
      <div className={styles.socialsTop}>
        <div className={styles.iconWrapper}>
          <a href={websiteContact.socials.instagram}>
            <img alt="social diniubire" className={styles.iconStyle} src={images.socialIcons.instagram} />
          </a>
          <a href={websiteContact.socials.whatsapp}>
            <img alt="social diniubire" className={styles.iconStyle} src={images.socialIcons.whatsapp} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
