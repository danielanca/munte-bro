import React from "react";
import { Card, Row, Col, Form, Button, ListGroup } from "react-bootstrap";

export type UserAccountDetailsProps = {
  /** The component's title. */
  title?: string;
};

const UserAccountDetails: React.FC<UserAccountDetailsProps> = ({
  title = "Account Details",
}) => {
  return (
    <Card className="mb-4">
      <Card.Header className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </Card.Header>

      <ListGroup variant="flush">
        <ListGroup.Item className="p-3">
          <Row>
            <Col>
              <Form>
                <Row>
                  {/* First / Last Name */}
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="feFirstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        placeholder="First Name"
                        defaultValue="Sierra"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="feLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        placeholder="Last Name"
                        defaultValue="Brooks"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  {/* Email / Password */}
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="feEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Email Address"
                        defaultValue="sierra@example.com"
                        autoComplete="email"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="fePassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        defaultValue="EX@MPL#P@$$w0RD"
                        autoComplete="current-password"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="feAddress" className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    placeholder="Address"
                    defaultValue="1234 Main St."
                  />
                </Form.Group>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="feCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control placeholder="City" />
                    </Form.Group>
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Group controlId="feInputState">
                      <Form.Label>State</Form.Label>
                      <Form.Select defaultValue="">
                        <option value="" disabled>
                          Choose...
                        </option>
                        <option>...</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2} className="mb-3">
                    <Form.Group controlId="feZipCode">
                      <Form.Label>Zip</Form.Label>
                      <Form.Control placeholder="Zip" />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group controlId="feDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows={5} />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary">Update Account</Button>
              </Form>
            </Col>
          </Row>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default UserAccountDetails;
