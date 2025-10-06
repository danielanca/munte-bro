// components/AdminArea/CustomSelect.tsx
import React from "react";
import { InputGroup, Form } from "react-bootstrap";

export interface CustomSelectProps {
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  value?: string;
}

const DEFAULT_OPTIONS = [
  { value: "", label: "Choose" },
  { value: "opt-1", label: "..." },
];

const CustomSelect: React.FC<CustomSelectProps> = ({
  options = DEFAULT_OPTIONS,
  placeholder = "Options",
  className,
  onChange,
  value,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    onChange?.(e.target.value);

  return (
    <div className={className}>
      {/* Prepend label */}
      <InputGroup className="mb-3">
        <InputGroup.Text>{placeholder}</InputGroup.Text>
        <Form.Select value={value} onChange={handleChange}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Form.Select>
      </InputGroup>

      {/* Append label */}
      <InputGroup className="mb-3">
        <Form.Select value={value} onChange={handleChange}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Form.Select>
        <InputGroup.Text>{placeholder}</InputGroup.Text>
      </InputGroup>
    </div>
  );
};

export default CustomSelect;
