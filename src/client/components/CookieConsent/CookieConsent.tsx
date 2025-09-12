import React from "react";
import { useEffect, useState } from "react";

import { getCookie, setCookie } from "./functions";
import { cookieConsent } from "../../data/componentStrings";
import styles from "./CookieConsent.module.scss";
import { CookiesTagConsent, userAcceptedCookies } from "../../data/constants";
import images from "../../data/images";
import allPathsURL from "../../data/allPathsURL.json";

const CookieConsent = () => {
  let pathname = window.location.pathname;
  let pathToBeIgnored = Object.values(allPathsURL.cookieConsentIgnoreList).find((element) => element === pathname);

  const [renderConsent, setConsent] = useState<boolean>();

  const getCookieConsent = () => {
    if (getCookie(CookiesTagConsent) === userAcceptedCookies || pathToBeIgnored !== undefined) return true;
    else return false;
  };

  const acceptCookie = () => {
    setCookie(CookiesTagConsent, userAcceptedCookies);
    setConsent(false);
  };
  useEffect(() => {
    setConsent(!getCookieConsent());
  }, [renderConsent]);

  return renderConsent ? (
    <div className={styles.cookiePopper}>
      <div className={styles.textArea}>
        <h4>
          <img className={styles.cookieIcon} src={images.cookieIcon} />
          {cookieConsent.headTitle}
        </h4>
        <p>
          {cookieConsent.mainText}
          <br />
          <a target={"_blank"} href="/termeni-si-conditii">
            {cookieConsent.secondText}
          </a>
        </p>
      </div>
      <div className={styles.acceptWrap}>
        <button className={styles.acceptCookiesBtn} onClick={acceptCookie}>
          {cookieConsent.acceptButton}
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CookieConsent;
