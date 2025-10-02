import React from "react";
import { Card, ButtonGroup, Button, Row, Col, Image } from "react-bootstrap";

type Discussion = {
  id?: number | string;
  date: string;
  author: { image: string; name: string; url: string };
  post: { title: string; url: string };
  body: string;
};

type DiscussionsProps = {
  title?: string;
  discussions?: Discussion[];
};

const Discussions: React.FC<DiscussionsProps> = ({ title = "Reviews", discussions = [] }) => (
  <Card className="blog-comments">
    <Card.Header>
      <h6 className="m-0">{title}</h6>
    </Card.Header>
    <Card.Body className="p-0">
      {discussions.map((d, idx) => (
        <div key={d.id ?? idx} className="d-flex p-3">
          <div className="me-3">
            <Image src={d.author.image} alt={d.author.name} roundedCircle />
          </div>
          <div className="px-3 flex-grow-1">
            <div className="text-muted">
              <a className="text-secondary" href={d.author.url}>{d.author.name}</a>{" on "}
              <a className="text-secondary" href={d.post.url}>{d.post.title}</a>
              <span className="text-muted"> - {d.date}</span>
            </div>
            <p className="m-0 my-1 mb-2 text-muted">{d.body}</p>
            <div>
              <ButtonGroup size="sm">
                <Button variant="light">Approve</Button>
                <Button variant="light">Reject</Button>
                <Button variant="light">Edit</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      ))}
    </Card.Body>
    <Card.Footer className="border-top">
      <Row>
        <Col className="text-center">
          <Button variant="light" type="button">View All Comments</Button>
        </Col>
      </Row>
    </Card.Footer>
  </Card>
);

export default Discussions;
