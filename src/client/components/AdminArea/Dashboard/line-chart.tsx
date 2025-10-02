import React from "react";
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { Card } from "react-bootstrap";

const LineChart: React.FC = () => {
  const series = [
    { name: "2018", type: "line", data: [20, 34, 27, 59, 37, 26, 38, 25] },
    { name: "2019", type: "area", data: [10, 24, 17, 49, 27, 16, 28, 15] },
  ];

  const options: ApexOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false } },
    colors: ["#45cb85", "#3b5de7"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3, dashArray: [4, 0] },
    markers: { size: 3 },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"], title: { text: "Month" } },
    fill: { type: "solid", opacity: [1, 0.1] },
    legend: { position: "top", horizontalAlign: "right" },
  };

  return (
    <Card>
      <Card.Header>Sales Report</Card.Header>
      <Card.Body>
        <ReactApexChart options={options} series={series} height={260} type="line" />
      </Card.Body>
    </Card>
  );
};

export default LineChart;
