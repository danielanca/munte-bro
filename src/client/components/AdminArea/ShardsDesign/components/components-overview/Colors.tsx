// components/AdminArea/Colors.tsx
import React from "react";
import { Row, Col } from "react-bootstrap";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "dark";

export interface ColorsProps {
  title?: string;
  variants?: Variant[];
  className?: string;
}

const DEFAULTS: Variant[] = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "dark",
];

const Colors: React.FC<ColorsProps> = ({
  title = "Colors",
  variants = DEFAULTS,
  className,
}) => {
  return (
    <Row className={className ? `mb-2 ${className}` : "mb-2"}>
      <Col lg={12}>
        <span style={{ fontSize: 16 }} className="d-block mb-2 text-muted">
          <strong>{title}</strong>
        </span>
      </Col>

      {variants.map((v) => (
        <Col key={v} className="mb-4">
          <div
            className={`bg-${v} text-white text-center rounded p-3`}
            style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
          >
            {v[0].toUpperCase() + v.slice(1)}
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default Colors;
