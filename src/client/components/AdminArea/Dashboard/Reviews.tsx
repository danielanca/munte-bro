// components/Overview.tsx
import React from "react";
import { Card, Col, Carousel } from "react-bootstrap";
import { FaQuoteLeft } from "react-icons/fa";

type Review = {
  initial?: string;
  name: string;
  role: string;
  text: string;
};

const reviews: Review[] = [
  {
    initial: "J",
    name: "Jessie Mitchell",
    role: "CEO of ABC Company",
    text:
      "To achieve this, it would be necessary to have uniform grammar, pronunciation and more common words.",
  },
  {
    initial: "K",
    name: "Kelly Rivera",
    role: "Web Developer",
    text:
      "For science, music, sport, etc., Europe uses the same vocabulary — languages only differ in their grammar.",
  },
  {
    initial: "S",
    name: "Simon Hawkins",
    role: "CEO of XYZ Company",
    text:
      "The new common language will be simpler and more regular than existing European languages.",
  },
];

const AvatarCircle: React.FC<{ initial?: string }> = ({ initial }) => (
  <span
    className="rounded-circle bg-primary bg-opacity-10 text-primary fw-semibold d-inline-flex justify-content-center align-items-center"
    style={{ width: 36, height: 36 }}
    aria-hidden
  >
    {initial ?? "?"}
  </span>
);

const Overview: React.FC = () => {
  return (
    <Col lg={3} xl={3}>
      <Card>
        <Card.Body>
          <h4 className="card-title mb-4">Reviews</h4>

          <div className="mb-4">
            <h5>
              <span className="text-primary">500</span>+ Satisfied clients
            </h5>
          </div>

          <div className="mb-3">
            <FaQuoteLeft className="h4 text-primary m-0" aria-hidden />
          </div>

          {/* React-Bootstrap carousel (no data-ride / data-bs-slide attrs needed) */}
          <Carousel controls indicators={false} interval={5500} fade>
            {reviews.map((r) => (
              <Carousel.Item key={r.name}>
                <p className="mb-0">{r.text}</p>
                <div className="d-flex align-items-start mt-4 gap-3">
                  <div className="avatar-sm">
                    <AvatarCircle initial={r.initial} />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{r.name}</h5>
                    <p className="mb-0 text-muted">{r.role}</p>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Overview;
