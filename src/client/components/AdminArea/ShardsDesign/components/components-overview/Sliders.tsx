// Sliders.tsx
import React, { useMemo, useState } from "react";
import { ListGroup, Form } from "react-bootstrap";
import { Range, getTrackBackground } from "react-range";

const MIN = 0;
const MAX = 100;

// ✅ Local param types compatible with react-range
type RenderTrackParams = {
  props: {
    onMouseDown: React.MouseEventHandler<HTMLDivElement>;
    onTouchStart: React.TouchEventHandler<HTMLDivElement>;
    ref: React.RefObject<HTMLDivElement>;
    style?: React.CSSProperties;
  };
  children: React.ReactNode;
};

type RenderThumbParams = {
  props: React.HTMLAttributes<HTMLDivElement> & { style: React.CSSProperties };
  index: number;
  isDragged: boolean;
};

const Sliders: React.FC = () => {
  const [successVal, setSuccessVal] = useState<number>(85);
  const [infoVal, setInfoVal] = useState<number>(15);
  const [rangeVals, setRangeVals] = useState<number[]>([35, 65]);

  const marks = useMemo<number[]>(() => [0, 25, 50, 75, 100], []);

  const renderTrack = ({ props, children }: RenderTrackParams) => (
    <div
      onMouseDown={props.onMouseDown}
      onTouchStart={props.onTouchStart}
      style={{ height: "36px", display: "flex", width: "100%" }}
    >
      <div
        ref={props.ref}
        style={{
          height: "5px",
          width: "100%",
          borderRadius: "4px",
          background: getTrackBackground({
            values: rangeVals,
            colors: ["#dee2e6", "#0d6efd", "#dee2e6"],
            min: MIN,
            max: MAX,
          }),
          alignSelf: "center",
        }}
      >
        {children}
      </div>
    </div>
  );

  const renderThumb = ({ props, index, isDragged }: RenderThumbParams) => (
    <div
      {...props}
      style={{
        ...props.style,
        height: "18px",
        width: "18px",
        borderRadius: "50%",
        backgroundColor: "#fff",
        border: "1px solid #ced4da",
        boxShadow: isDragged ? "0 0 0 0.25rem rgba(13,110,253,.25)" : "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      aria-label={`Thumb ${index}`}
    >
      <div
        style={{
          position: "absolute",
          top: "-28px",
          padding: "2px 6px",
          borderRadius: "3px",
          backgroundColor: "#212529",
          color: "#fff",
          fontSize: 12,
        }}
      >
        {rangeVals[index]}
      </div>
    </div>
  );

  return (
    <ListGroup.Item className="px-3">
      <div className="mb-2 pb-1">
        <strong className="text-muted d-block">Custom Sliders</strong>

        <div className="my-4">
          <Form.Range
            min={MIN}
            max={MAX}
            value={successVal}
            onChange={(e) => setSuccessVal(Number(e.target.value))}
            style={{ height: 5 }}
          />
          <div className="mt-1 small text-success">{successVal}</div>
        </div>

        <div className="my-4">
          <Form.Range
            min={MIN}
            max={MAX}
            value={infoVal}
            onChange={(e) => setInfoVal(Number(e.target.value))}
            style={{ height: 5 }}
          />
          <div className="mt-1 small text-info">{infoVal}</div>
        </div>

        <div className="my-4">
          <Range
            values={rangeVals}
            step={1}
            min={MIN}
            max={MAX}
            onChange={(vals: number[]) => setRangeVals(vals)}
            renderTrack={renderTrack}
            renderThumb={renderThumb}
          />

          <div className="d-flex justify-content-between mt-2">
            {marks.map((m) => (
              <div key={m} className="text-muted small" style={{ transform: "translateX(-50%)" }}>
                |<div style={{ fontSize: 11 }}>{m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ListGroup.Item>
  );
};

export default Sliders;
