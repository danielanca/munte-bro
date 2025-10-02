import React, { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { Card } from "react-bootstrap";

type Props = { layoutWidth?: "boxed" | string };

const RevenueChart: React.FC<Props> = ({ layoutWidth }) => {
  const series = useMemo(
    () => [
      { name: "Series A", data: [11, 17, 15, 15, 21, 14] },
      { name: "Series B", data: [13, 23, 20, 8, 13, 27] },
      { name: "Series C", data: [44, 55, 41, 67, 22, 43] },
    ],
    []
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: { stacked: true, toolbar: { show: false }, zoom: { enabled: true } },
      plotOptions: { bar: { horizontal: false, columnWidth: "20%", endingShape: "rounded" } },
      dataLabels: { enabled: false },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
      colors: ["#eef3f7", "#ced6f9", "#3b5de7"],
      fill: { opacity: 1 },
    }),
    []
  );

  const width = layoutWidth === "boxed" ? 260 : 296.828;

  return (
    <Card>
      <Card.Header>Revenue</Card.Header>
      <Card.Body>
        <ReactApexChart options={options} series={series} type="bar" height={260} width={width} />
      </Card.Body>
    </Card>
  );
};

export default RevenueChart;
