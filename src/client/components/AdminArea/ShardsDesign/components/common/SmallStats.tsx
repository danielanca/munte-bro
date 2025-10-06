// SmallStats.tsx
import React, { useEffect, useMemo, useRef } from "react";
import classNames from "classnames";
import { Card } from "react-bootstrap";

import Chart from "chart.js/auto"; // value (constructable)
import type { Chart as ChartJS, ChartConfiguration } from "chart.js"; // types

type Dataset = { data: number[]; [key: string]: any };

export type SmallStatsProps = {
  /** Optional DOM id applied to the Card wrapper */
  id?: string;
  variation?: string;
  label?: string;
  value?: number | string;
  percentage?: number | string;
  increase?: boolean;
  /** Some callers pass this; we accept it even if styling is handled by CSS classes */
  decrease?: boolean;
  chartConfig?: Record<string, any>;
  chartOptions?: Record<string, any>;
  chartData?: Dataset[];
  /** Allow nulls coming from callers (e.g., BlogOverview defaults) */
  chartLabels?: (string | number | null)[];
};

const SmallStats: React.FC<SmallStatsProps> = ({
  id,
  variation = "1",
  label = "Label",
  value = 0,
  percentage = 0,
  increase = true,
  decrease, // accepted; class styling already reflects `increase`
  chartConfig = Object.create(null),
  chartOptions = Object.create(null),
  chartData = [],
  chartLabels = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  const canvasClass = useMemo(() => {
    const uid =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    return `stats-small-${uid}`;
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    // Sanitize labels: convert null/undefined to empty strings so Chart.js accepts them
    const safeLabels: (string | number)[] = (chartLabels ?? []).map((l) =>
      l == null ? "" : l
    );

    const suggestedMax =
      chartData?.[0]?.data?.length ? Math.max(...chartData[0].data) + 1 : undefined;

    const mergedOptions = {
      maintainAspectRatio: true,
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        ...(chartOptions.plugins ?? {}),
      },
      elements: {
        point: { radius: 0 },
        line: { tension: 0.33 },
        ...(chartOptions.elements ?? {}),
      },
      scales: {
        x: { grid: { display: false }, ticks: { display: false }, ...(chartOptions.scales?.x ?? {}) },
        y: {
          grid: { display: false },
          ticks: { display: false, suggestedMax, ...(chartOptions.scales?.y?.ticks ?? {}) },
          ...(chartOptions.scales?.y ?? {}),
        },
        ...(chartOptions.scales ?? {}),
      },
      ...chartOptions,
    };

    const config: ChartConfiguration<"line", number[], string | number> = {
      type: "line",
      data: { labels: safeLabels, datasets: chartData as any },
      options: mergedOptions,
      ...(chartConfig as any),
    };

    chartRef.current = new Chart(el, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [chartLabels, chartData, chartOptions, chartConfig]);

  const cardClasses = classNames("stats-small", variation && `stats-small--${variation}`);
  const cardBodyClasses = classNames(variation === "1" ? "p-0 d-flex" : "px-0 pb-0");
  const innerWrapperClasses = classNames("d-flex", variation === "1" ? "flex-column m-auto" : "px-3");
  const dataFieldClasses = classNames("stats-small__data", variation === "1" && "text-center");
  const labelClasses = classNames("stats-small__label", "text-uppercase", variation !== "1" && "mb-1");
  const valueClasses = classNames("stats-small__value", "count", variation === "1" ? "my-3" : "m-0");
  const innerDataFieldClasses = classNames(
    "stats-small__data",
    variation !== "1" && "text-right align-items-center"
  );
  const percentageClasses = classNames(
    "stats-small__percentage",
    `stats-small__percentage--${increase ? "increase" : "decrease"}`
  );

  const canvasHeight = variation === "1" ? 120 : 60;

  return (
    <Card id={id} className={cardClasses}>
      <Card.Body className={cardBodyClasses}>
        <div className={innerWrapperClasses}>
          <div className={dataFieldClasses}>
            <span className={labelClasses}>{label}</span>
            <h6 className={valueClasses}>{value}</h6>
          </div>
          <div className={innerDataFieldClasses}>
            <span className={percentageClasses}>{percentage}</span>
          </div>
        </div>
        <canvas ref={canvasRef} height={canvasHeight} className={canvasClass} />
      </Card.Body>
    </Card>
  );
};

export default SmallStats;
