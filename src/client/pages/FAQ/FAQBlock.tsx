import React, { useEffect, useRef } from "react";
import QuestionCardboard from "./QuestionCardboard";
import { FAQ } from "./../../data/strings.json";
import uniqueId from "lodash/uniqueId";

import styles from "./FAQBlock.module.scss";

// import { useOnScreen } from "../hooks/onScreen";

const FAQBlock = () => {
  const ref = useRef(null);
  // const isVisible = useOnScreen(ref);

  // useEffect(() => {
  //   if (isVisible) {
  //     ReactGA.event("user_scrollOn_FAQ");
  //   }
  // }, [isVisible]);

  return (
    <div ref={ref} className={styles.questionsBlock}>
      <h3 className={styles.bookTextTop}>{FAQ.topText}</h3>
      <h3 className={styles.bookTextDown}>{FAQ.bottomText}</h3>

      <div className={styles.cardsWrapper}>
        {Object.values(FAQ.questionList).map((item: any) => (
          <QuestionCardboard key={uniqueId()}  theQuestion={{ question: item.question, answer: item.answer }} />
        ))}
      </div>
    </div>
  );
};

export default FAQBlock;
