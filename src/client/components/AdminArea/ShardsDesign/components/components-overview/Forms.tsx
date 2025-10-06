// components/AdminArea/Forms.tsx
import React from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";

export interface FormsProps {
  title?: string;
}

const Forms: React.FC<FormsProps> = ({ title = "Forms" }) => {
  return (
    <Col sm={12} md={6}>
      <strong className="text-muted d-block mb-2">{title}</strong>

      <Form>
        {/* Username with @ prepend */}
        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text>@</InputGroup.Text>
            <Form.Control placeholder="Username" />
          </InputGroup>
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            value="myCoolPassword"
            readOnly // mirrors your onChange={() => {}} no-op
          />
        </Form.Group>

        {/* Address */}
        <Form.Group className="mb-3">
          <Form.Control
            placeholder="1234 Main St"
            value="7898 Kensington Junction, New York, USA"
            readOnly
          />
        </Form.Group>

        {/* City + Select row */}
        <Row className="g-3">
          <Col md={7}>
            <Form.Control value="New York" readOnly />
          </Col>
          <Col md={5}>
            <Form.Select defaultValue="">
              <option value="">Choose ...</option>
              <option>...</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>
    </Col>
  );
};

export default Forms;
