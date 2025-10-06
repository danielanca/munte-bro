// components/AdminArea/NewDraft.tsx
import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

export interface NewDraftProps {
  /** The card title shown in the header */
  title?: string;
  /** Optional submit handler (receives title & body) */
  onCreate?: (payload: { title: string; body: string }) => void;
}

const NewDraft: React.FC<NewDraftProps> = ({ title = "New Draft", onCreate }) => {
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onCreate?.({ title: draftTitle.trim(), body: draftBody.trim() });
    // optional: clear after submit
    setDraftTitle("");
    setDraftBody("");
  };

  return (
    <Card className="h-100">
      <Card.Header className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </Card.Header>

      <Card.Body className="d-flex flex-column">
        <Form onSubmit={handleSubmit} className="quick-post-form">
          <Form.Group className="mb-3" controlId="newDraftTitle">
            <Form.Control
              type="text"
              placeholder="Brave New World"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newDraftBody">
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Words can be like X-rays if you use them properly..."
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
            />
          </Form.Group>

          <div className="mb-0">
            <Button type="submit" variant="primary">
              Create Draft
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewDraft;
