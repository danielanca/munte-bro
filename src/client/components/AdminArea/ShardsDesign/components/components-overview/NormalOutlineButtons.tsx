// NormalOutlineButtons.tsx
import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const NormalOutlineButtons: React.FC = () => (
  <Row>
    <Col>
      <Button variant="outline-primary" className="mb-2 mx-1">
        Primary
      </Button>
      <Button variant="outline-secondary" className="mb-2 mx-1">
        Secondary
      </Button>
      <Button variant="outline-success" className="mb-2 mx-1">
        Success
      </Button>
      <Button variant="outline-danger" className="mb-2 mx-1">
        Danger
      </Button>
      <Button variant="outline-warning" className="mb-2 mx-1">
        Warning
      </Button>
      <Button variant="outline-info" className="mb-2 mx-1">
        Info
      </Button>
      <Button variant="outline-dark" className="mb-2 mx-1">
        Dark
      </Button>
      <Button variant="outline-light" className="mb-2 mx-1">
        Light
      </Button>
    </Col>
  </Row>
);

export default NormalOutlineButtons;
