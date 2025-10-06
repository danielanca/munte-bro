import React from "react";
import { Row, Col } from "react-bootstrap";

interface Props {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <Row className="page-header py-4">
      <Col>
        <h2 className="mb-0">{title}</h2>
        {subtitle && <p className="text-muted">{subtitle}</p>}
      </Col>
    </Row>
  );
};

export default PageHeader;
