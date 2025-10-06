// components/AdminArea/DropdownInputGroups.tsx
import React, { useState } from "react";
import { InputGroup, Form, DropdownButton, Dropdown } from "react-bootstrap";

export interface DropdownItemDef {
  key: string;
  label: string;
}

export interface DropdownInputGroupsProps {
  items?: DropdownItemDef[];
  onSelectItem?: (key: string) => void;
  placeholder?: string;
  className?: string;
}

const DEFAULT_ITEMS: DropdownItemDef[] = [
  { key: "action", label: "Action" },
  { key: "another", label: "Another action" },
  { key: "something", label: "Something else here" },
];

const DropdownInputGroups: React.FC<DropdownInputGroupsProps> = ({
  items = DEFAULT_ITEMS,
  onSelectItem,
  placeholder = "",
  className,
}) => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  // Explicitly type both params to silence TS7006
  const handleSelect = (
    eventKey: string | null,
    _e: React.SyntheticEvent<unknown> | null
  ) => {
    if (eventKey) onSelectItem?.(eventKey);
  };

  return (
    <div className={className}>
      {/* Input with dropdown appended (right side) */}
      <InputGroup className="mb-3">
        <Form.Control
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          placeholder={placeholder}
        />
        <DropdownButton
          id="input-group-dropdown-append"
          title="Dropdown"
          align="end"
          show={open1}
          onToggle={(isOpen) => setOpen1(isOpen)}
          variant="outline-secondary"
          onSelect={handleSelect}
        >
          {items.map((it) => (
            <Dropdown.Item key={it.key} eventKey={it.key}>
              {it.label}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </InputGroup>

      {/* Input with dropdown prepended (left side) */}
      <InputGroup className="mb-3">
        <DropdownButton
          id="input-group-dropdown-prepend"
          title="Dropdown"
          show={open2}
          onToggle={(isOpen) => setOpen2(isOpen)}
          variant="outline-secondary"
          onSelect={handleSelect}
        >
          {items.map((it) => (
            <Dropdown.Item key={it.key} eventKey={it.key}>
              {it.label}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Form.Control
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          placeholder={placeholder}
        />
      </InputGroup>
    </div>
  );
};

export default DropdownInputGroups;
