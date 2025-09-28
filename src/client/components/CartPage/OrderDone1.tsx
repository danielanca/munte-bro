import React from "react";
import images from "../../data/images1";
import strings from "../../data/strings.json";
import styles from "./OrderDone1.module.scss";

const formatSubtitle = (subtitle: string) => {
  const subtitleDesc = subtitle.split(' ');
  const formattedSubtitle = subtitleDesc.map((word, index) => {
    if (word === 'Dinmunte.') {
      return <span key={index} className={styles.DinMunte}>Dinmunte. </span>;
    } else {
      return <span key={index}>{word} </span>;
    }
  });

  return <React.Fragment>{formattedSubtitle}</React.Fragment>;
};

  const verificatiSubtitleEmail = (verificati_subtitle: string) => {
    const emailText = verificati_subtitle.split(' ');

    const email = emailText.map((email, index)=>{
      if(email === "info@dinmunte.ro"){
        return <span className={styles.emailText} key={index}>{email}</span>
      }
      else{
        return <span key={index}>{email} </span>
      }
    })

    return <React.Fragment>{email}</React.Fragment>
  }


const OrderDone = () => {
  let { OrderDone: doneString } = strings;

  return (
    <div role={"contentinfo"} className={styles.confirmContainer}>
      <div className={styles.horizontalAlign}>
        <p className={styles.title}>
          {doneString.title}
        </p>
        <p className={styles.mainDescription}>
          {formatSubtitle(doneString.subtitle)}
        </p>
      </div>

      <div className={styles.tickIcon}>
        <img src={images.tick} alt="" className={styles.tick} />
      </div>
      <div>
        <p className={styles.verificati_title}>{doneString.verificati_title}</p>
        <p className={styles.verificati_subtitle}>{verificatiSubtitleEmail(doneString.verificati_subtitle)}</p>
      </div>
    </div>
  );
};

export default OrderDone;
