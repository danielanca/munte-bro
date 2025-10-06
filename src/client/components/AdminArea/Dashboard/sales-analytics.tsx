import React, { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { Card, Row, Col } from "react-bootstrap";

const SalesAnalytics: React.FC = () => {
  const labels = useMemo(() => ["Online", "Offline", "Marketing"], []);
  const colors = useMemo(() => ["#3b5de7", "#45cb85", "#eeb902"], []);
  const series = useMemo<number[]>(() => [38, 26, 14], []);
  // If you want these dynamic, compute from series instead:
  const amounts = useMemo<number[]>(() => [2652, 2284, 1753], []);
  const total = useMemo(() => amounts.reduce((a, b) => a + b, 0), [amounts]);

  const options: ApexOptions = useMemo(
    () => ({
      labels,
      colors,
      chart: { toolbar: { show: false } },
      legend: { show: false },
      dataLabels: { enabled: false },
      tooltip: {
        y: {
          formatter: (val) =>
            `$ ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "75%",
            labels: {
              show: true,
              name: { show: true, offsetY: 8 },
              value: {
                show: true,
                formatter: (val) =>
                  `$ ${Number(val).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}`,
              },
              total: {
                show: true,
                label: "Total",
                formatter: () =>
                  `$ ${total.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}`,
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 576,
          options: {
            chart: { height: 240 },
          },
        },
      ],
      stroke: { width: 0 },
    }),
    [labels, colors, total]
  );

  return (
    <Card>
      <Card.Header>Sales Analytics</Card.Header>
      <Card.Body>
        <Row className="align-items-center">
          <Col sm={6} className="mb-3 mb-sm-0">
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={245}
            />
          </Col>

          <Col sm={6}>
            <Row>
              {labels.map((label, idx) => (
                <Col xs={6} className="py-3" key={label}>
                  <p className="mb-1 text-truncate d-flex align-items-center">
                    {/* Replace this dot with MDI if you’ve included its CSS */}
                    <span
                      className="me-2 rounded-circle"
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        background: colors[idx],
                      }}
                    />
                    {label}
                  </p>
                  <h5>
                    $
                    {" "}{amounts[idx].toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </h5>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SalesAnalytics;
