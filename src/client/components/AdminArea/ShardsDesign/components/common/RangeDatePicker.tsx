import React, { useEffect, useState, forwardRef } from "react";
import classNames from "classnames";
import { InputGroup, Form } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../../assets/range-date-picker.css";

type EmitMode = "number" | "string"; // default = "number"

type RangeDatePickerProps = {
  className?: string;
  /** How to emit the selected values (default "number" = timestamps) */
  emit?: EmitMode;
  /** Called once both dates are selected, then the picker resets */
  onValues?: (payload: {
    dates: {
      startDate: string | number; // keep wide so your handler fits
      endDate: string | number;
    };
  }) => void;
};

type ControlInputProps = React.ComponentProps<typeof Form.Control>;
const ControlInput = forwardRef<HTMLInputElement, ControlInputProps>(
  ({ className, ...props }, ref) => (
    <Form.Control ref={ref} size="sm" className={className} {...props} />
  )
);
ControlInput.displayName = "ControlInput";

const RangeDatePicker: React.FC<RangeDatePickerProps> = ({
  className,
  onValues,
  emit = "number",
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const classes = classNames("date-range", "d-flex", "my-auto", className);

  const serialize = (d: Date): string | number =>
    emit === "string" ? d.toISOString() : d.getTime();

  useEffect(() => {
    if (startDate && endDate && onValues) {
      onValues({
        dates: {
          startDate: serialize(startDate),
          endDate: serialize(endDate),
        },
      });
      // reset (match legacy behavior)
      setStartDate(null);
      setEndDate(null);
    }
  }, [startDate, endDate, emit, onValues]);

  return (
    <InputGroup className={classes}>
      <ReactDatePicker
        selected={startDate}
        onChange={(d: Date | null) => setStartDate(d)}
        placeholderText="Start Date"
        dropdownMode="select"
        customInput={<ControlInput className="text-center bg-light fw-bold" />}
        isClearable
        selectsStart
        startDate={startDate ?? undefined}
        endDate={endDate ?? undefined}
      />

      <ReactDatePicker
        selected={endDate}
        onChange={(d: Date | null) => setEndDate(d)}
        placeholderText="End Date"
        dropdownMode="select"
        customInput={<ControlInput className="text-center bg-light fw-bold" />}
        isClearable
        selectsEnd
        startDate={startDate ?? undefined}
        endDate={endDate ?? undefined}
        minDate={startDate ?? undefined}
      />

      <InputGroup.Text aria-hidden>
        <i className="material-icons">&#xE916;</i>
      </InputGroup.Text>
    </InputGroup>
  );
};

export default RangeDatePicker;
