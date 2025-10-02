import React from "react";
import { Card, Col, Row } from "react-bootstrap";

const Overview: React.FC = () => {
  return (
    <Col lg={6}>
      <Card>
        <Card.Header>Revenue by location</Card.Header>
        <Card.Body>
          <Row>
            <Col sm={6}>
              <div id="usa-vectormap" style={{ height: 230 }} />
            </Col>
            <Col sm={5} className="ms-auto">
              <div className="mt-4 mt-sm-0">
                <p>Last month Revenue</p>

                <div className="d-flex align-items-start py-3">
                  <div className="flex-grow-1">
                    <p className="mb-2">California</p>
                    <h5 className="mb-0">$ 2,256</h5>
                  </div>
                  <div className="ms-auto">
                    2.52 % <i className="mdi mdi-arrow-up text-success ms-1" />
                  </div>
                </div>

                <div className="d-flex align-items-start py-3 border-top">
                  <div className="flex-grow-1">
                    <p className="mb-2">Nevada</p>
                    <h5 className="mb-0">$ 1,853</h5>
                  </div>
                  <div className="ms-auto">
                    1.26 % <i className="mdi mdi-arrow-up text-success ms-1" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Overview;
