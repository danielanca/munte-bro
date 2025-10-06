// ToggleButtons.tsx
import React from "react";
import { Col, Form } from "react-bootstrap";

const ToggleButtons: React.FC = () => (
  <Col sm={12} md={4} className="mb-3">
    <strong className="text-muted d-block mb-2">Toggle Switches</strong>
    <fieldset>
      <Form.Check
        type="switch"
        id="switch-default"
        label="Default"
        className="mb-2"
      />
      <Form.Check
        type="switch"
        id="switch-checked"
        label="Checked"
        defaultChecked
        className="mb-2"
      />
      <Form.Check
        type="switch"
        id="switch-disabled"
        label="Disabled"
        disabled
        className="mb-2"
      />
      <Form.Check
        type="switch"
        id="switch-disabled-checked"
        label="Disabled Checked"
        defaultChecked
        disabled
        className="mb-2"
      />
    </fieldset>
  </Col>
);

export default ToggleButtons;
