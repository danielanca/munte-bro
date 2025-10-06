// components/AdminArea/CustomFileUpload.tsx
import React, { useRef, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

export interface CustomFileUploadProps {
  id?: string;
  label?: string;               // Button label
  accept?: string;              // e.g. "image/*,.pdf"
  multiple?: boolean;
  onFilesSelected?: (files: FileList) => void;
  disabled?: boolean;
  className?: string;
}

const CustomFileUpload: React.FC<CustomFileUploadProps> = ({
  id = "customFile2",
  label = "Choose file...",
  accept,
  multiple = false,
  onFilesSelected,
  disabled = false,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [displayName, setDisplayName] = useState<string>("No file chosen");

  const handleClick = () => inputRef.current?.click();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setDisplayName("No file chosen");
      return;
    }
    // Build a concise display name
    const names = Array.from(files).map((f) => f.name);
    setDisplayName(multiple ? `${names.length} files selected` : names[0]);

    onFilesSelected?.(files);
  };

  return (
    <div className={className}>
      {/* Hidden native input for accessibility + browser picker */}
      <Form.Control
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="d-none"
        disabled={disabled}
      />

      <InputGroup className="mb-3">
        <Button
          variant="secondary"
          onClick={handleClick}
          disabled={disabled}
          aria-controls={id}
        >
          {label}
        </Button>
        <InputGroup.Text
          as="label"
          htmlFor={id}
          className="w-100 text-truncate"
          onClick={handleClick}
          role="button"
          aria-label="Selected files"
          title={displayName}
        >
          {displayName}
        </InputGroup.Text>
      </InputGroup>
    </div>
  );
};

export default CustomFileUpload;
