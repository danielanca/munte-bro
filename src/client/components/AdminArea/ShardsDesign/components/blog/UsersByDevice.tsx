import React, { useEffect, useRef } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type UsersByDeviceProps = {
  title?: string;
  chartData?: ChartData<"pie", number[], string>;
  chartOptions?: ChartOptions<"pie">;
};

const defaultData: ChartData<"pie", number[], string> = {
  labels: ["Desktop", "Tablet", "Mobile"],
  datasets: [
    {
      data: [68.3, 24.2, 7.5],
      backgroundColor: ["rgba(0,123,255,0.9)", "rgba(0,123,255,0.5)", "rgba(0,123,255,0.3)"],
      hoverBorderColor: "#ffffff",
    },
  ],
};

const defaultOptions: ChartOptions<"pie"> = {
  plugins: {
    legend: { position: "bottom", labels: { padding: 25, boxWidth: 20 } },
    tooltip: { mode: "index", intersect: false },
  },
};

const UsersByDevice: React.FC<UsersByDeviceProps> = ({
  title = "Users by device",
  chartData = defaultData,
  chartOptions = defaultOptions,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS<"pie"> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new ChartJS(canvasRef.current, {
      type: "pie",
      data: chartData,
      options: chartOptions,
    });
    return () => chartRef.current?.destroy();
  }, [chartData, chartOptions]);

  return (
    <Card className="h-100">
      <Card.Header>
        <h6 className="m-0">{title}</h6>
      </Card.Header>
      <Card.Body className="d-flex py-0">
        <canvas ref={canvasRef} height={220} className="m-auto" />
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col>
            <Form.Select size="sm" style={{ maxWidth: 130 }} defaultValue="last-week">
              <option value="last-week">Last Week</option>
              <option value="today">Today</option>
              <option value="last-month">Last Month</option>
              <option value="last-year">Last Year</option>
            </Form.Select>
          </Col>
          <Col className="text-end">
            <a href="#">View full report &rarr;</a>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default UsersByDevice;
