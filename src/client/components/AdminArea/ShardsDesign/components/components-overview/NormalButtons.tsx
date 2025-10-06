// NormalButtons.tsx
import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const NormalButtons: React.FC = () => (
  <Row>
    <Col>
      <Button variant="primary" className="mb-2 mx-1">
        Primary
      </Button>
      <Button variant="secondary" className="mb-2 mx-1">
        Secondary
      </Button>
      <Button variant="success" className="mb-2 mx-1">
        Success
      </Button>
      <Button variant="danger" className="mb-2 mx-1">
        Danger
      </Button>
      <Button variant="warning" className="mb-2 mx-1">
        Warning
      </Button>
      <Button variant="info" className="mb-2 mx-1">
        Info
      </Button>
      <Button variant="dark" className="mb-2 mx-1">
        Dark
      </Button>
      <Button variant="light" className="mb-2 mx-1">
        Light
      </Button>
    </Col>
  </Row>
);

export default NormalButtons;
