// components/AdminArea/Checkboxes.tsx
import React from "react";
import { Col, Form } from "react-bootstrap";

export interface CheckboxesProps extends React.ComponentProps<typeof Col> {
  /** Section title above the checkboxes */
  title?: string;
}

const Checkboxes: React.FC<CheckboxesProps> = ({
  title = "Checkboxes",
  className,
  ...colProps
}) => {
  const colClass = className ? `mb-3 ${className}` : "mb-3";

  return (
    <Col sm={12} md={4} className={colClass} {...colProps}>
      <strong className="text-muted d-block mb-2">{title}</strong>
      <fieldset>
        <Form.Check type="checkbox" id="chk-default" label="Default" />
        <Form.Check type="checkbox" id="chk-checked" label="Checked" defaultChecked />
        <Form.Check type="checkbox" id="chk-disabled" label="Disabled" disabled />
        <Form.Check
          type="checkbox"
          id="chk-disabled-checked"
          label="Disabled Checked"
          disabled
          defaultChecked
        />
      </fieldset>
    </Col>
  );
};

export default Checkboxes;
