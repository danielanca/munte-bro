import React from "react";
import { Card, ListGroup, Button } from "react-bootstrap";

type SidebarActionsProps = {
  title?: string;
};

const SidebarActions: React.FC<SidebarActionsProps> = ({ title = "Actions" }) => (
  <Card className="mb-3">
    <Card.Header>
      <h6 className="m-0">{title}</h6>
    </Card.Header>
    <Card.Body className="p-0">
      <ListGroup variant="flush">
        <ListGroup.Item className="p-3">
          <div className="d-flex mb-2">
            <span className="mx-1">flag</span>
            <strong className="mx-1">Status:</strong> Draft
            <a className="ms-auto fw-bold" href="#">Edit</a>
          </div>
          <div className="d-flex mb-2">
            <span className="mx-1">visibility</span>
            <strong className="mx-1">Visibility:</strong> <strong className="text-success">Public</strong>
            <a className="ms-auto fw-bold" href="#">Edit</a>
          </div>
          <div className="d-flex mb-2">
            <span className="mx-1">calendar_today</span>
            <strong className="mx-1">Schedule:</strong> Now
            <a className="ms-auto fw-bold" href="#">Edit</a>
          </div>
          <div className="d-flex">
            <span className="mx-1">score</span>
            <strong className="mx-1">Readability:</strong> <strong className="text-warning">Ok</strong>
          </div>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex flex-wrap justify-content-around px-3 border-0">
          <Button variant="outline-primary" size="sm" className="mx-1 flex-fill">
            Save Draft
          </Button>
          <Button variant="primary" size="sm" className="mx-1 flex-fill">
            Publish
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Card.Body>
  </Card>
);

export default SidebarActions;
