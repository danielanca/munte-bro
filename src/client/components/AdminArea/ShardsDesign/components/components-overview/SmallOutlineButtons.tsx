// SmallOutlineButtons.tsx
import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const SmallOutlineButtons: React.FC = () => (
  <Row>
    <Col>
      <Button size="sm" variant="outline-primary" className="mb-2 mx-1">
        Primary
      </Button>
      <Button size="sm" variant="outline-secondary" className="mb-2 mx-1">
        Secondary
      </Button>
      <Button size="sm" variant="outline-success" className="mb-2 mx-1">
        Success
      </Button>
      <Button size="sm" variant="outline-danger" className="mb-2 mx-1">
        Danger
      </Button>
      <Button size="sm" variant="outline-warning" className="mb-2 mx-1">
        Warning
      </Button>
      <Button size="sm" variant="outline-info" className="mb-2 mx-1">
        Info
      </Button>
      <Button size="sm" variant="outline-dark" className="mb-2 mx-1">
        Dark
      </Button>
      <Button size="sm" variant="outline-light" className="mb-2 mx-1">
        Light
      </Button>
    </Col>
  </Row>
);

export default SmallOutlineButtons;
