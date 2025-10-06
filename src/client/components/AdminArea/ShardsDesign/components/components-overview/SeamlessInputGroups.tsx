// SeamlessInputGroups.tsx
import React, { useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";

const SeamlessInputGroups: React.FC = () => {
  const [username, setUsername] = useState<string>("design.revision");
  const [password, setPassword] = useState<string>("mySuperSecretPassword");
  const [recipient, setRecipient] = useState<string>("");

  // Common "seamless" classes
  const ctrlClass = "border-0 bg-transparent shadow-none";
  const textClass = "bg-transparent border-0";

  return (
    <div>
      {/* person + username */}
      <InputGroup className="mb-3">
        <InputGroup.Text className={textClass}>
          <i className="material-icons" aria-hidden>
            person
          </i>
        </InputGroup.Text>
        <Form.Control
          aria-label="Username"
          className={ctrlClass}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </InputGroup>

      {/* password + lock (append) */}
      <InputGroup className="mb-3">
        <Form.Control
          type="password"
          aria-label="Password"
          className={ctrlClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputGroup.Text className={textClass}>
          <i className="material-icons" aria-hidden>
            lock
          </i>
        </InputGroup.Text>
      </InputGroup>

      {/* recipient + button (append) */}
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Recipient's username"
          aria-label="Recipient username"
          className={ctrlClass}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Button variant="light" className="border-0">
          Button
        </Button>
      </InputGroup>
    </div>
  );
};

export default SeamlessInputGroups;
