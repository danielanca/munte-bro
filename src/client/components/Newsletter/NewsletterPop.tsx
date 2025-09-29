import React, { useState, useEffect, useCallback } from "react";
import ReactGA from "react-ga4";
import validator from "validator";
import styles from "./NewsletterPop.module.scss";
import parse from "html-react-parser";
import InputComponent from "./InputComponent";

import { SubscriptionType, Sub, emailValidType, inputStateEmail } from "../../data/constants";
import { NewsProps, responseProps, EventInsert } from "../../utils/NewsletterInterface";
import { addToNewsletter } from "../../services/emails";
import strings from "../../data/strings.json";
import { newsletter } from "./../../data/componentStrings";

const NewsletterPop = () => {
  const { NewsletterTermsAccept: NewsletterString } = strings;
  const [emailValid, setEmailValid] = useState<emailValidType>(inputStateEmail.init);
  const [newsletterData, setNewsletterData] = useState<NewsProps>({ fullName: "", email: "" });
  const [userSubscribed, setSubscribed] = useState<SubscriptionType>(Sub.initState);
  const [eventInsert, setEventInsert] = useState<EventInsert | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [userTriedToSubscribe, setUserTriedToSubscribe] = useState<boolean>(false);

  const emailValidate = (email: string) => {
    if (validator.isEmail(email)) return true;
    else return false;
  };
  const sendEvent = (eventLabel: string) => {
    if (eventInsert === null || Object.prototype.hasOwnProperty.call(!eventInsert, eventLabel)) {
      setEventInsert((eventInsert) => ({ ...eventInsert, [eventLabel]: "Triggered" }));
      ReactGA.event(`user_Newsletterinput_${eventLabel}`);
    }
  };

  const inputHandler = useCallback(
    (data: React.ChangeEvent<HTMLInputElement>) => {
      sendEvent(data.target.name);
      const { name, value } = data.target;
      setNewsletterData((newsletterData) => ({
        ...newsletterData,
        [name]: value
      }));
    },
    [newsletterData]
  );
  const subscribeToNewsletter = () => {
    setUserTriedToSubscribe(true);
    if (termsAccepted && emailValid === inputStateEmail.valid) {
      try {
        addToNewsletter(newsletterData).then((result) => {
          try {
            result.json().then((response: responseProps) => {
              setSubscribed(response.subscribeToNewsletter);
              console.log("subscribe response:", JSON.stringify(response));
            });
          } catch (e) {
            console.log(e);
            setSubscribed(Sub.SubscribedState);
          }
        });
      } catch (e) {
        console.log("error:", e);
      }
    }
  };

  useEffect(() => {
    if (emailValidate(newsletterData.email)) {
      setEmailValid(inputStateEmail.valid);
    } else if (newsletterData.email.length < 1) {
      setEmailValid(inputStateEmail.init);
    } else {
      setEmailValid(inputStateEmail.notValid);
    }
  }, [newsletterData.email]);

  const layoutTransition = () => {
    if (userSubscribed === Sub.SubscribedState) {
      return `${styles.rightPanel} ${styles.imageSubscribed}`;
    } else {
      return `${styles.rightPanel}`;
    }
  };

  const switchHandler = (switchValue: boolean) => {
    setUserTriedToSubscribe(false);
    setTermsAccepted(switchValue);
  };

  return (
    <div className={styles.newsletterContainer}>
      <div className={userSubscribed !== Sub.SubscribedState ? styles.imageFeatured : styles.imageFeaturedTransition}>
        <div className={styles.textArea}>
          <h3 className={userSubscribed !== Sub.SubscribedState ? styles.title : styles.titleSubscribed}>
            {userSubscribed !== Sub.SubscribedState
              ? newsletter.userSubscribe.notYet
              : newsletter.userSubscribe.subscribed}
          </h3>
          <h4 className={userSubscribed !== Sub.SubscribedState ? styles.description : styles.descriptionSubscription}>
            {userSubscribed !== Sub.SubscribedState ? newsletter.userMessage.notYet : newsletter.userMessage.subscribed}
          </h4>
        </div>
      </div>
      <div className={layoutTransition()}>
        <div className={styles.containerWrap}>
          <div className={styles.textContain}>
            <p className={styles.newsletterText}>{parse(newsletter.bigText)}</p>
          </div>
          <div className={styles.inputArea}>
            <input
              type={"inputNewsletter"}
              autoComplete="off"
              id="fullName"
              name="fullName"
              placeholder={"Nume"}
              value={newsletterData.fullName}
              onChange={inputHandler}
            />
            <input
              className={
                emailValid === inputStateEmail.valid || emailValid === inputStateEmail.init ? "" : styles.invalidEmail
              }
              type={"inputNewsletter"}
              autoComplete="off"
              id="email"
              name="email"
              placeholder={"E-mail"}
              value={newsletterData.email}
              onChange={inputHandler}
            />
          </div>
          <div className={styles.termArea}>
            <InputComponent theme={"blue"} typeOfInput="checkbox" onSwitchEnabled={switchHandler} />
            <p className={styles.termsText}>{NewsletterString.subscribeConsent}</p>
          </div>
          <button onClick={subscribeToNewsletter} className={styles.newsSubscribeButton}>
            {NewsletterString.SubscribeMe}
          </button>

          <div className={styles.termsWarningContainer}>
            {userTriedToSubscribe && !termsAccepted ? (
              <p className={styles.termsWarning}>{NewsletterString.warningConsent}</p>
            ) : (
              userTriedToSubscribe &&
              (emailValid === inputStateEmail.notValid || emailValid === inputStateEmail.init) && (
                <p className={styles.termsWarning}>{NewsletterString.detailsWarning}</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPop;
