import React, { useEffect, useMemo, useRef } from "react";
import classNames from "classnames";
import { Card } from "react-bootstrap";

// Your local Chart wrapper (kept as-is)
import Chart from "../../utils/chart";

type Dataset = {
  data: number[];
  [key: string]: any; // allow extra Chart.js props (borderColor, fill, etc.)
};

export type SmallStatsProps = {
  /** Variation toggles spacing/height presets used by the old styles */
  variation?: string; // e.g. "1", "2"
  /** The label. */
  label?: string;
  /** The value. */
  value?: number | string;
  /** The percentage string/number (e.g., "+12.3%"). */
  percentage?: number | string;
  /** Whether it's an increase (green) vs decrease (red). */
  increase?: boolean;

  /** Chart.js config overrides (merged). */
  chartConfig?: Record<string, any>;
  /** Chart.js options overrides (merged). */
  chartOptions?: Record<string, any>;
  /** Datasets passed to Chart.js. */
  chartData?: Dataset[];
  /** Labels for the X axis. */
  chartLabels?: (string | number)[];
};

const SmallStats: React.FC<SmallStatsProps> = ({
  variation = "1",
  label = "Label",
  value = 0,
  percentage = 0,
  increase = true,
  chartConfig = Object.create(null),
  chartOptions = Object.create(null),
  chartData = [],
  chartLabels = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null);

  // Generate a stable, unique class once per mount (no shortid).
  const canvasClass = useMemo(() => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    return `stats-small-${id}`;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const suggestedMax =
      chartData?.[0]?.data?.length
        ? Math.max(...chartData[0].data) + 1
        : undefined;

    const mergedOptions = {
      maintainAspectRatio: true,
      responsive: true,
      legend: { display: false },
      tooltips: { enabled: false, custom: false },
      elements: {
        point: { radius: 0 },
        line: { tension: 0.33 },
      },
      scales: {
        xAxes: [
          {
            gridLines: false,
            ticks: { display: false },
          },
        ],
        yAxes: [
          {
            gridLines: false,
            scaleLabel: false,
            ticks: {
              display: false,
              // Chart.js cut-off fix from original
              suggestedMax,
            },
          },
        ],
      },
      ...chartOptions,
    };

    const mergedConfig = {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: chartData,
      },
      options: mergedOptions,
      ...chartConfig,
    };

    chartRef.current = new Chart(canvasRef.current, mergedConfig);

    return () => {
      try {
        chartRef.current?.destroy?.();
      } catch {
        // ignore if wrapper has no destroy
      }
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartLabels, chartData, chartOptions, chartConfig]);

  const cardClasses = classNames("stats-small", variation && `stats-small--${variation}`);
  const cardBodyClasses = classNames(variation === "1" ? "p-0 d-flex" : "px-0 pb-0");
  const innerWrapperClasses = classNames("d-flex", variation === "1" ? "flex-column m-auto" : "px-3");
  const dataFieldClasses = classNames("stats-small__data", variation === "1" && "text-center");
  const labelClasses = classNames("stats-small__label", "text-uppercase", variation !== "1" && "mb-1");
  const valueClasses = classNames("stats-small__value", "count", variation === "1" ? "my-3" : "m-0");
  const innerDataFieldClasses = classNames("stats-small__data", variation !== "1" && "text-right align-items-center");
  const percentageClasses = classNames(
    "stats-small__percentage",
    `stats-small__percentage--${increase ? "increase" : "decrease"}`
  );

  const canvasHeight = variation === "1" ? 120 : 60;

  return (
    <Card className={cardClasses}>
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
