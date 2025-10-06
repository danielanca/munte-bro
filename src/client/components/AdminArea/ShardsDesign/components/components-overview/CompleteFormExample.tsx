// components/AdminArea/CompleteFormExample.tsx
import React, { useState } from "react";
import { ListGroup, Row, Col, Form, Button } from "react-bootstrap";

export interface CompleteFormValues {
  email: string;
  password: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  agreed: boolean;
}

export interface CompleteFormExampleProps {
  onSubmit?: (values: CompleteFormValues) => void;
}

const CompleteFormExample: React.FC<CompleteFormExampleProps> = ({ onSubmit }) => {
  const [values, setValues] = useState<CompleteFormValues>({
    email: "",
    password: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    agreed: false,
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (e) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  return (
    <ListGroup variant="flush">
      <ListGroup.Item className="p-3">
        <Row>
          <Col>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="feEmailAddress">Email</Form.Label>
                  <Form.Control
                    id="feEmailAddress"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="fePassword">Password</Form.Label>
                  <Form.Control
                    id="fePassword"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </Col>
              </Row>

              <div className="mb-3">
                <Form.Label htmlFor="feInputAddress">Address</Form.Label>
                <Form.Control
                  id="feInputAddress"
                  name="address1"
                  placeholder="1234 Main St"
                  value={values.address1}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <Form.Label htmlFor="feInputAddress2">Address 2</Form.Label>
                <Form.Control
                  id="feInputAddress2"
                  name="address2"
                  placeholder="Apartment, Studio or Floor"
                  value={values.address2}
                  onChange={handleChange}
                />
              </div>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="feInputCity">City</Form.Label>
                  <Form.Control
                    id="feInputCity"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Label htmlFor="feInputState">State</Form.Label>
                  <Form.Select
                    id="feInputState"
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                  >
                    <option value="">Choose...</option>
                    <option value="AL">Alabama</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Col>
                <Col md={2} className="mb-3">
                  <Form.Label htmlFor="feInputZip">Zip</Form.Label>
                  <Form.Control
                    id="feInputZip"
                    name="zip"
                    value={values.zip}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Check
                    id="privacy-agree"
                    name="agreed"
                    type="checkbox"
                    label={
                      <>
                        I agree with your{" "}
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a href="#">Privacy Policy</a>.
                      </>
                    }
                    checked={values.agreed}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>

              <Button type="submit">Create New Account</Button>
            </Form>
          </Col>
        </Row>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default CompleteFormExample;
