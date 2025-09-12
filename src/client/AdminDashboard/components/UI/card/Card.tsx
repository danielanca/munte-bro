import React, { ReactNode } from "react";
import classes from "./Card.module.scss";

interface CardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = props => {
  return <div className={classes.card}>{props.children}</div>;
};

export default Card;
