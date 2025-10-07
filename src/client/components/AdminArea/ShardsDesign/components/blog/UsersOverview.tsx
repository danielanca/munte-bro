import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import RangeDatePicker from "../common/RangeDatePicker";

// type-only imports won't run at SSR time
import type { ChartOptions, ChartData } from "chart.js";

type UsersOverviewProps = {
  title?: string;
  chartData?: ChartData<"line", number[], string>;
  chartOptions?: ChartOptions<"line">;
};

const defaultData: ChartData<"line", number[], string> = {
  labels: Array.from({ length: 30 }, (_, i) => String(i === 0 ? 1 : i)),
  datasets: [
    {
      label: "Current Month",
      data: [
        500, 800, 320, 180, 240, 320, 230, 650, 590, 1200, 750, 940, 1420, 1200, 960, 1450, 1820, 2800, 2102, 1920,
        3920, 3202, 3140, 2800, 3200, 3200, 3400, 2910, 3100, 4250,
      ],
      fill: "start",
      backgroundColor: "rgba(0,123,255,0.1)",
      borderColor: "rgba(0,123,255,1)",
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 3,
      pointBackgroundColor: "#ffffff",
      pointHoverBackgroundColor: "rgb(0,123,255)",
      tension: 0.3,
    },
    {
      label: "Past Month",
      data: [
        380, 430, 120, 230, 410, 740, 472, 219, 391, 229, 400, 203, 301, 380, 291, 620, 700, 300, 630, 402, 320, 380,
        289, 410, 300, 530, 630, 720, 780, 1200,
      ],
      fill: "start",
      backgroundColor: "rgba(255,65,105,0.1)",
      borderColor: "rgba(255,65,105,1)",
      borderWidth: 1,
      pointRadius: 0,
      pointHoverRadius: 2,
      tension: 0.3,
    },
  ],
};

const defaultOptions: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    tooltip: { mode: "nearest", intersect: false },
  },
  interaction: { mode: "nearest", intersect: false },
  scales: {
    x: { grid: { display: false } },
    y: {
      suggestedMax: 4500,
      ticks: {
        callback: value => {
          const n = Number(value);
          return n > 999 ? `${(n / 1000).toFixed(1)}K` : String(n);
        },
      },
    },
  },
};

const UsersOverview: React.FC<UsersOverviewProps> = ({
  title = "Users Overview",
  chartData = defaultData,
  chartOptions = defaultOptions,
}) => {
  // React component from react-chartjs-2 loaded lazily
  const [LineComp, setLineComp] = React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      // Load chart.js in a way that works for both CJS and ESM distributions
      const chartMod = await import("chart.js");
      // If it's CJS, the real API is on .default
      const ChartPkg: any = (chartMod as any).default ?? chartMod;

      const { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } = ChartPkg;

      // Register pieces once in the browser
      Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

      // Load the React wrapper only on the client
      const { Line } = await import("react-chartjs-2");
      if (mounted) setLineComp(() => Line);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card className='h-100'>
      <Card.Header>
        <h6 className='m-0'>{title}</h6>
      </Card.Header>
      <Card.Body className='pt-0'>
        <Row className='border-bottom py-2 bg-light gx-2'>
          <Col sm={6} className='d-flex mb-2 mb-sm-0'>
            <RangeDatePicker />
          </Col>
          <Col className='text-sm-end text-center'>
            <Button size='sm' className='mt-3 mt-sm-0' variant='light'>
              View Full Report &rarr;
            </Button>
          </Col>
        </Row>

        <div style={{ height: 300, width: "100%" }}>
          {LineComp ? <LineComp data={chartData} options={chartOptions} /> : null /* could render a skeleton here */}
        </div>
      </Card.Body>
    </Card>
  );
};

export default UsersOverview;
