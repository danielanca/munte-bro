import React, { useState } from "react";
import { Card, ListGroup, Row, Col, Form } from "react-bootstrap";

export type ReferralItem = {
  title: string;
  value: string | number;
};

export type TopReferralsProps = {
  title?: string;
  referralData?: ReferralItem[];
  /** Controlled time range (optional). */
  timeRange?: "today" | "last-week" | "last-month" | "last-year";
  /** Notify parent when time range changes (optional). */
  onTimeRangeChange?: (range: TopReferralsProps["timeRange"]) => void;
  /** Click handler for “Full report →” (optional). */
  onViewReport?: () => void;
};

const DEFAULT_DATA: ReferralItem[] = [
  { title: "GitHub", value: "19,291" },
  { title: "Stack Overflow", value: "11,201" },
  { title: "Hacker News", value: "9,291" },
  { title: "Reddit", value: "8,281" },
  { title: "The Next Web", value: "7,128" },
  { title: "TechCrunch", value: "6,218" },
  { title: "YouTube", value: "1,218" },
  { title: "Adobe", value: "1,171" },
];

const TopReferrals: React.FC<TopReferralsProps> = ({
  title = "Top Referrals",
  referralData = DEFAULT_DATA,
  timeRange,
  onTimeRangeChange,
  onViewReport,
}) => {
  // Uncontrolled fallback if parent doesn't pass a controlled timeRange
  const [internalRange, setInternalRange] =
    useState<TopReferralsProps["timeRange"]>("last-week");
  const currentRange = timeRange ?? internalRange;

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as TopReferralsProps["timeRange"];
    if (onTimeRangeChange) onTimeRangeChange(next);
    if (timeRange === undefined) setInternalRange(next);
  };

  return (
    <Card className="h-100">
      <Card.Header className="border-bottom d-flex align-items-center justify-content-between">
        <h6 className="m-0">{title}</h6>
        {/* Optional handle/icon area from your original markup */}
        <div className="block-handle" />
      </Card.Header>

      <Card.Body className="p-0">
        <ListGroup variant="flush" className="list-group-small">
          {referralData.map((item, idx) => (
            <ListGroup.Item key={idx} className="d-flex px-3">
              <span className="text-semibold text-fiord-blue">{item.title}</span>
              <span className="ms-auto text-end text-semibold text-reagent-gray">
                {item.value}
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>

      <Card.Footer className="border-top">
        <Row className="align-items-center">
          <Col>
            <Form.Select
              size="sm"
              value={currentRange}
              style={{ maxWidth: 130 }}
              onChange={handleRangeChange}
            >
              <option value="last-week">Last Week</option>
              <option value="today">Today</option>
              <option value="last-month">Last Month</option>
              <option value="last-year">Last Year</option>
            </Form.Select>
          </Col>

          <Col className="text-end view-report">
            {/* Use a button for accessibility; parent can attach a handler */}
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={onViewReport}
            >
              Full report &rarr;
            </button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default TopReferrals;
