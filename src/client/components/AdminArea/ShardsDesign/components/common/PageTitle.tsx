import React from "react";
import classNames from "classnames";
import { Col } from "react-bootstrap";

type PageTitleProps = {
  /** The page title. */
  title?: string;
  /** The page subtitle. */
  subtitle?: string;
  /** Extra classes for the Col wrapper. */
  className?: string;
} & Omit<React.ComponentProps<typeof Col>, "className" | "children">;

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, className, ...attrs }) => {
  const classes = classNames(className, "text-left", "text-md-left", "mb-sm-0");

  return (
    <Col xs={12} sm={4} className={classes} {...attrs}>
      {subtitle && <span className="text-uppercase page-subtitle">{subtitle}</span>}
      {title && <h3 className="page-title">{title}</h3>}
    </Col>
  );
};

export default PageTitle;
