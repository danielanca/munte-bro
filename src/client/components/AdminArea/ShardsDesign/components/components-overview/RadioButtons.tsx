// RadioButtons.tsx
import React from "react";
import { Col, Form } from "react-bootstrap";

const RadioButtons: React.FC = () => (
  <Col sm={12} md={4} className="mb-3">
    <strong className="text-muted d-block mb-2">Radio Buttons</strong>
    <fieldset>
      <Form.Check
        type="radio"
        name="exampleRadios"
        id="radio-default"
        label="Default"
      />
      <Form.Check
        type="radio"
        name="exampleRadios"
        id="radio-checked"
        label="Checked"
        defaultChecked
      />
      <Form.Check
        type="radio"
        name="exampleRadios"
        id="radio-disabled"
        label="Disabled"
        disabled
      />
      <Form.Check
        type="radio"
        name="exampleRadios"
        id="radio-disabled-checked"
        label="Disabled Checked"
        disabled
        defaultChecked
      />
    </fieldset>
  </Col>
);

export default RadioButtons;
