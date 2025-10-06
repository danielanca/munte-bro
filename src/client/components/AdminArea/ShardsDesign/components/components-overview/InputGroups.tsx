// InputGroups.tsx
import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

const InputGroups: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [namePart, setNamePart] = useState<string>("catalin");
  const [amount, setAmount] = useState<string>("1000");

  return (
    <div>
      {/* @username */}
      <InputGroup className="mb-3">
        <InputGroup.Text>@</InputGroup.Text>
        <Form.Control
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-label="Username"
        />
      </InputGroup>

      {/* name@domain */}
      <InputGroup className="mb-3">
        <Form.Control
          value={namePart}
          onChange={(e) => setNamePart(e.target.value)}
          aria-label="Local part of email"
        />
        <InputGroup.Text>@designrevision.com</InputGroup.Text>
      </InputGroup>

      {/* $amount.00 */}
      <InputGroup className="mb-3">
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-label="Amount"
          inputMode="numeric"
        />
        <InputGroup.Text>.00</InputGroup.Text>
      </InputGroup>
    </div>
  );
};

export default InputGroups;
