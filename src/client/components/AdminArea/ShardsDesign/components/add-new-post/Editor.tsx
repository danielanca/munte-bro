import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";

const Editor: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [ReactQuill, setReactQuill] = useState<any>(null);

  useEffect(() => {
    // Only import react-quill on client side
    const loadReactQuill = async () => {
      if (typeof window !== 'undefined') {
        const module = await import("react-quill");
        setReactQuill(() => module.default);
      }
    };

    loadReactQuill();
  }, []);

  // Configure Quill modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Show loading state during SSR or while loading
  if (!ReactQuill) {
    return (
      <Card className="mb-3">
        <Card.Body>
          <Form>
            <Form.Control
              size="lg"
              className="mb-3 text-muted fw-bold"
              placeholder="Your Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div 
              style={{ 
                height: '200px', 
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6c757d'
              }}
            >
              Loading rich text editor...
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <Form>
          <Form.Control
            size="lg"
            className="mb-3 text-muted fw-bold"
            placeholder="Your Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ReactQuill 
            className="add-new-post__editor mb-1" 
            value={body} 
            onChange={setBody}
            modules={modules}
            theme="snow"
          />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Editor;