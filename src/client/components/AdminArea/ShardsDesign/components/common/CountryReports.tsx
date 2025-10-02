import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Form, ListGroup } from "react-bootstrap";
import classNames from "classnames";

// --- Types -------------------------------------------------------------------

export type CountryItem = {
  flag: string;                 // URL or imported asset path
  title: string;                // Country name
  visitorsAmount: string | number;
  visitorsPercentage: string;   // e.g. "23.32%"
};

export type CountryReportsProps = {
  title?: string;
  countries?: CountryItem[];
  /** Google Charts data table: first row headers, then [country, users] */
  mapsData?: (string | number)[][];
  /** Optional controlled time range + handlers */
  timeRange?: "today" | "last-week" | "last-month" | "last-year";
  onTimeRangeChange?: (v: CountryReportsProps["timeRange"]) => void;
  /** Optional className for the card */
  className?: string;
  /** Google Maps API key (recommended via env) */
  mapsApiKey?: string;
};

// Optional global typing for the Google object (lightweight)
declare global {
  interface Window {
    google?: any;
    __SDPGoogleChartLoaded__?: boolean;
  }
}

// --- Defaults ----------------------------------------------------------------

const DEFAULT_COUNTRIES: CountryItem[] = [
  { flag: "/images/flags/flag-us.png", title: "United States", visitorsAmount: "12,291", visitorsPercentage: "23.32%" },
  { flag: "/images/flags/flag-uk.png", title: "United Kingdom", visitorsAmount: "11,192", visitorsPercentage: "18.8%" },
  { flag: "/images/flags/flag-au.png", title: "Australia", visitorsAmount: "9,291", visitorsPercentage: "12.3%" },
  { flag: "/images/flags/flag-jp.png", title: "Japan", visitorsAmount: "2,291", visitorsPercentage: "8.14%" },
];

const DEFAULT_MAPS_DATA: (string | number)[][] = [
  ["Country", "Users"],
  ["United States", 12219],
  ["United Kingdom", 11192],
  ["Australia", 9291],
  ["Japan", 2291],
];

// --- Component ---------------------------------------------------------------

const CountryReports: React.FC<CountryReportsProps> = ({
  title = "Users by Country",
  countries = DEFAULT_COUNTRIES,
  mapsData = DEFAULT_MAPS_DATA,
  timeRange,
  onTimeRangeChange,
  className,
  mapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "", // prefer env
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const [internalRange, setInternalRange] =
    useState<CountryReportsProps["timeRange"]>("last-week");
  const currentRange = timeRange ?? internalRange;

  // Load Google Charts script once per page
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (window.__SDPGoogleChartLoaded__) return;
      window.__SDPGoogleChartLoaded__ = true;

      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://www.gstatic.com/charts/loader.js";
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load Google Charts"));
        document.body.appendChild(s);
      });
    };

    load().catch(() => {
      // You could surface an error UI here
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize and draw the GeoChart when google is ready
  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.google || !window.google.charts) return;

    const { google } = window;

    google.charts.load("current", {
      packages: ["geochart"],
      // If you don't need maps features beyond the GeoChart, mapsApiKey can be omitted.
      mapsApiKey: mapsApiKey || undefined,
    });

    const onLoad = () => {
      if (!mapRef.current) return;

      const data = google.visualization.arrayToDataTable(mapsData);
      const options = {
        colorAxis: { colors: ["#B9C2D4", "#E4E8EF"] },
        legend: "none",
        width: "100%",
        // height controlled via container style
      };

      const chart = new google.visualization.GeoChart(mapRef.current);
      chartRef.current = chart;

      const draw = () => chart.draw(data, options);
      draw();

      window.addEventListener("resize", draw);
      // cleanup: remove resize handler on unmount
      return () => window.removeEventListener("resize", draw);
    };

    google.charts.setOnLoadCallback(onLoad);

    // cleanup chart instance on unmount
    return () => {
      try {
        chartRef.current?.clearChart?.();
      } catch {
        // ignore
      }
      chartRef.current = null;
    };
  }, [mapsData, mapsApiKey]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as CountryReportsProps["timeRange"];
    onTimeRangeChange?.(next);
    if (timeRange === undefined) setInternalRange(next);
  };

  return (
    <Card className={classNames("country-stats", className)}>
      <Card.Header className="border-bottom d-flex align-items-center justify-content-between">
        <h6 className="m-0">{title}</h6>
        <div className="block-handle" />
      </Card.Header>

      <Card.Body className="p-0">
        {/* Map Container */}
        <div
          ref={mapRef}
          style={{ width: "100%", height: 180 }}
          aria-label="Users by Country map"
        />

        {/* Countries Table List */}
        <div className="table-responsive">
          <table className="table m-0">
            <tbody>
              {countries.map((country, idx) => (
                <tr key={idx}>
                  <td>
                    <img
                      className="country-flag mx-1"
                      src={country.flag}
                      alt={country.title}
                      style={{ width: 20, height: 14, objectFit: "cover" }}
                    />
                    {country.title}
                  </td>
                  <td className="text-end">{country.visitorsAmount}</td>
                  <td className="text-end">{country.visitorsPercentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>

      <Card.Footer className="border-top">
        <Row className="align-items-center">
          <Col>
            <Form.Select
              size="sm"
              value={currentRange}
              onChange={handleRangeChange}
              style={{ maxWidth: 130 }}
            >
              <option value="last-week">Last Week</option>
              <option value="today">Today</option>
              <option value="last-month">Last Month</option>
              <option value="last-year">Last Year</option>
            </Form.Select>
          </Col>

          <Col className="text-end view-report">
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={() => {
                // hook up navigation if desired
              }}
            >
              View full report &rarr;
            </button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default CountryReports;
