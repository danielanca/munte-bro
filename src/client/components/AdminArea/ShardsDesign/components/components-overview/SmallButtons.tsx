// SmallButtons.tsx
import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const SmallButtons: React.FC = () => (
  <Row className="mb-3 mt-2">
    <Col>
      <Button size="sm" variant="primary" className="mb-2 mx-1">
        Primary
      </Button>
      <Button size="sm" variant="secondary" className="mb-2 mx-1">
        Secondary
      </Button>
      <Button size="sm" variant="success" className="mb-2 mx-1">
        Success
      </Button>
      <Button size="sm" variant="danger" className="mb-2 mx-1">
        Danger
      </Button>
      <Button size="sm" variant="warning" className="mb-2 mx-1">
        Warning
      </Button>
      <Button size="sm" variant="info" className="mb-2 mx-1">
        Info
      </Button>
      <Button size="sm" variant="dark" className="mb-2 mx-1">
        Dark
      </Button>
      <Button size="sm" variant="light" className="mb-2 mx-1">
        White
      </Button>
    </Col>
  </Row>
);

export default SmallButtons;
