import React from "react";
import { Card, ListGroup, Button, InputGroup, Form, FormControl } from "react-bootstrap";

type SidebarCategoriesProps = {
  title?: string;
};

const SidebarCategories: React.FC<SidebarCategoriesProps> = ({ title = "Categories" }) => (
  <Card className="mb-3">
    <Card.Header>
      <h6 className="m-0">{title}</h6>
    </Card.Header>
    <Card.Body className="p-0">
      <ListGroup variant="flush">
        <ListGroup.Item className="px-3 pb-2">
          <Form.Check className="mb-1" value="uncategorized" defaultChecked label="Uncategorized" />
          <Form.Check className="mb-1" value="design" defaultChecked label="Design" />
          <Form.Check className="mb-1" value="development" label="Development" />
          <Form.Check className="mb-1" value="writing" label="Writing" />
          <Form.Check className="mb-1" value="books" label="Books" />
        </ListGroup.Item>

        <ListGroup.Item className="d-flex px-3">
          <InputGroup className="ms-auto">
            <FormControl placeholder="New category" />
            <Button variant="light" className="px-2">+</Button>
          </InputGroup>
        </ListGroup.Item>
      </ListGroup>
    </Card.Body>
  </Card>
);

export default SidebarCategories;
