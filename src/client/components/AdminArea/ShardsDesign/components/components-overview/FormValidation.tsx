// FormValidation.tsx
import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";

const FormValidation: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("Vasile");
  const [lastName, setLastName] = useState<string>("Catalin");
  const [username, setUsername] = useState<string>("");
  const [state, setState] = useState<string>("");

  const usernameTaken = username.trim().toLowerCase() === "admin"; // example rule
  const selectInvalid = state === ""; // example rule

  return (
    <Col sm={12} md={6}>
      <strong className="text-muted d-block mb-2">Form Validation</strong>

      <Form noValidate>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              value={firstName}
              placeholder="First name"
              onChange={(e) => setFirstName(e.target.value)}
              isValid={firstName.trim().length > 0}
            />
            <Form.Control.Feedback type="valid">
              The first name looks good!
            </Form.Control.Feedback>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              required
              value={lastName}
              placeholder="Last name"
              onChange={(e) => setLastName(e.target.value)}
              isValid={lastName.trim().length > 0}
            />
            <Form.Control.Feedback type="valid">
              The last name looks good!
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isInvalid={usernameTaken}
          />
          <Form.Control.Feedback type="invalid">
            The username is taken.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="state">
          <Form.Label>State</Form.Label>
          <Form.Select
            value={state}
            onChange={(e) => setState(e.target.value)}
            isInvalid={selectInvalid}
          >
            <option value="">Choose</option>
            <option value="..." >...</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please select your state
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
    </Col>
  );
};

export default FormValidation;
