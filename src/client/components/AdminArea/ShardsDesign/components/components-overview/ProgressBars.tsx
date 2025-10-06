// ProgressBars.tsx
import React from "react";
import { ListGroup, ProgressBar } from "react-bootstrap";

const ProgressBars: React.FC = () => (
  <ListGroup.Item className="px-3">
    <div className="mb-2">
      <strong className="text-muted d-block mb-3">Progress Bars</strong>

      <ProgressBar now={50} className="mb-3" style={{ height: "5px" }} />
      <ProgressBar variant="success" now={40} className="mb-3" style={{ height: "5px" }} />
      <ProgressBar variant="info" now={60} className="mb-3" style={{ height: "5px" }} />
      <ProgressBar variant="danger" now={80} className="mb-3" style={{ height: "5px" }} />
    </div>
  </ListGroup.Item>
);

export default ProgressBars;
