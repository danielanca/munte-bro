import React, { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { Card, Row, Col } from "react-bootstrap";

const SalesAnalytics: React.FC = () => {
  const series = useMemo<number[]>(() => [38, 26, 14], []);
  const options: ApexOptions = useMemo(
    () => ({
      labels: ["Online", "Offline", "Marketing"],
      plotOptions: { pie: { donut: { size: "75%" } } },
      legend: { show: false },
      colors: ["#3b5de7", "#45cb85", "#eeb902"],
      chart: { toolbar: { show: false } }
    }),
    []
  );

  return (
    <Card>
      <Card.Header>Sales Analytics</Card.Header>
      <Card.Body>
        <Row className="align-items-center">
          <Col sm={6}>
            <ReactApexChart options={options} series={series} type="donut" height={245} />
          </Col>
          <Col sm={6}>
            <Row>
              <Col xs={6} className="py-3">
                <p className="mb-1 text-truncate">
                  <i className="mdi mdi-circle text-primary me-1" /> Online
                </p>
                <h5>$ 2,652</h5>
              </Col>
              <Col xs={6} className="py-3">
                <p className="mb-1 text-truncate">
                  <i className="mdi mdi-circle text-success me-1" /> Offline
                </p>
                <h5>$ 2,284</h5>
              </Col>
              <Col xs={6} className="py-3">
                <p className="mb-1 text-truncate">
                  <i className="mdi mdi-circle text-warning me-1" /> Marketing
                </p>
                <h5>$ 1,753</h5>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SalesAnalytics;
