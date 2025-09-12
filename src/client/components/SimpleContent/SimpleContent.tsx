import React from "react";
import styles from "./SimpleContent.module.scss";

import parse from "html-react-parser";
import HelmetHead from '../../components/mini/HelmetHead/HelmetHead';
import { staticContent } from "../../data/contentLegal";
import '../../styles/_customCSS.scss'

interface SimpleProps {
  type: string;
}

const SimpleContent = ({ type }: SimpleProps) => {
  const renderData = () => {
    return parse(staticContent[type].jsonContent);
  };

  return (
    <>
      <HelmetHead title={staticContent[type].title} description={staticContent[type].jsonContent} />

      <div className={styles.content}>
        <h3 className={styles.headTitle}>{staticContent[type].title.substring(0, 100)}</h3>
        <div className={styles.plainData}>{renderData()}</div>
      </div>
    </>
  );
};

export default SimpleContent;
