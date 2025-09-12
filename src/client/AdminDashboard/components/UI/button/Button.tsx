// src/client/AdminDashboard/components/UI/button/Button.tsx
import React, { ReactNode } from "react";
import classes from "./Button.module.scss";

interface Props {
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  outline?: boolean;
  children?: ReactNode;
}

const Button: React.FC<Props> = ({ type = "button", onClick, outline, children }) => {
  return (
    <button className={`${classes.btn} ${outline ? classes.outline : classes.button}`} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
