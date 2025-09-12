import React from "react";
import { useTranslation } from "react-i18next";
import { IsummData as Props } from "../../interfaces/IsummData";
import { Icon } from "@iconify/react";
import Card from "../UI/card/Card";
import classes from "./SummaryBox.module.scss";

const SummaryBox: React.FC<{ item: Props }> = ({ item }) => {
  const { t } = useTranslation();

  return (
    <div className={classes.summary__box}>
      <Card>
        <div className={classes.summary__box__wrapper}>
          <div className={classes.summary__box__icon}>
            <Icon icon={item.icon} width="56" />
          </div>
          <div className={classes.summary__box__info}>
            <p>{t(item.text)}</p>
            <div className={classes.summary__box__info__amount}>
              <h4>{item.amount}</h4>
              {item.currency && <h4>{t(item.currency)}</h4>}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryBox;
