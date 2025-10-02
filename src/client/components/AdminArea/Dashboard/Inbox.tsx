import React from "react";
import { Link } from "react-router-dom";
import { Card, Col, ListGroup, Image, Button } from "react-bootstrap";

import avatar1 from "../../../assets/admin/users/avatar-3.jpg";
import avatar2 from "../../../assets/admin/users/avatar-4.jpg";
import avatar3 from "../../../assets/admin/users/avatar-5.jpg";
import avatar4 from "../../../assets/admin/users/avatar-6.jpg";

type InboxItem = { id: number; img: string; name: string; desc: string; time: string };

const Overview: React.FC = () => {
  const inbox: InboxItem[] = [
    { id: 1, img: avatar1, name: "Paul", desc: "Hey! there I'm available", time: "05 min" },
    { id: 2, img: avatar2, name: "Mary", desc: "This theme is awesome!", time: "12 min" },
    { id: 3, img: avatar3, name: "Cynthia", desc: "Nice to meet you", time: "18 min" },
    { id: 4, img: avatar4, name: "Darren", desc: "I've finished it! See you so", time: "2hr ago" }
  ];

  return (
    <Col lg={4}>
      <Card>
        <Card.Header>Inbox</Card.Header>
        <ListGroup variant="flush">
          {inbox.map(item => (
            <ListGroup.Item key={item.id} className="d-flex align-items-start gap-3">
              <Image src={item.img} alt={item.name} roundedCircle width={40} height={40} />
              <div className="flex-grow-1 overflow-hidden">
                <div className="fw-semibold">{item.name}</div>
                <div className="text-truncate">{item.desc}</div>
              </div>
              <small className="text-nowrap">{item.time}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Body className="text-center">
          <Link to="#">
            <Button size="sm">Load more</Button>
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Overview;
