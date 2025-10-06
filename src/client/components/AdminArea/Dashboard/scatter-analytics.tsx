// ScatterChart.tsx
import React from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { Card } from "react-bootstrap";

type ScatterPoint = [number, number];
type ScatterSeries = { name: string; data: ScatterPoint[] }[];

const ScatterChart: React.FC = () => {
  const series: ScatterSeries = [
    {
      name: "Series A",
      data: [
        [2, 5], [7, 2], [4, 3], [5, 2], [6, 1],
        [1, 3], [2, 7], [8, 0], [9, 8], [6, 0], [10, 1],
      ],
    },
    {
      name: "Series B",
      data: [
        [15, 13], [7, 11], [5, 8], [9, 17], [11, 4],
        [14, 12], [13, 14], [8, 9], [4, 13], [7, 7],
        [5, 8], [4, 3],
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "scatter",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: true, type: "xy" },
    },
    colors: ["#3b5de7", "#45cb85"],
    xaxis: { tickAmount: 10 },
    yaxis: { tickAmount: 7 },
    legend: { position: "top" },
  };

  return (
    <Card>
      <Card.Body>
        <h4 className="mb-4">Monthly Sales</h4>
        <ReactApexChart options={options} series={series} type="scatter" height={225} />
      </Card.Body>
    </Card>
  );
};

export default ScatterChart;
