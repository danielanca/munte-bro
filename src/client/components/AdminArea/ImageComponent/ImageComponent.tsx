// ImagesComponent.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "./ImagesComponent.css";

interface ImageComponentProps {
  existingImageUrls?: string[];                  // initial URLs (0..2)
  onUrlsUpdated: (newUrls: string[]) => void;    // send updated URLs to parent
  onDelete: (index: number) => void;             // parent delete handler
}

const SLOTS = 3;

const ImageComponent: React.FC<ImageComponentProps> = ({
  existingImageUrls = [],
  onUrlsUpdated,
  onDelete,
}) => {
  // Keep local previews for instant feedback (may be blob: URLs before upload)
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    () => Array.from({ length: SLOTS }, (_, i) => existingImageUrls[i] ?? "")
  );

  // Track uploading state (optional: per-index if you prefer)
  const [uploading, setUploading] = useState<boolean>(false);

  // Refs to file inputs so we can trigger them from the placeholder button
  const fileInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Keep previews in sync if parent changes existingImageUrls
  useEffect(() => {
    setImagePreviews(Array.from({ length: SLOTS }, (_, i) => existingImageUrls[i] ?? ""));
  }, [existingImageUrls]);

  // Utility: revoke a blob URL (avoid memory leaks)
  const revokeIfBlob = (url?: string) => {
    if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
  };

  const handlePickFile = useCallback((index: number) => {
    fileInputsRef.current[index]?.click();
  }, []);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      // Instant preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => {
        // Clean old blob if any
        revokeIfBlob(prev[index]);
        const next = [...prev];
        next[index] = previewUrl;
        return next;
      });

      try {
        const storage = getStorage(); // uses default app; or pass your initialized app: getStorage(app)
        const uniqueFileName = `${uuidv4()}_${file.name}`;
        const fileRef = storageRef(storage, `reviewsMedia/${uniqueFileName}`);

        await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(fileRef);

        // Update parent URLs array (ensure fixed length of 3)
        const nextUrls = Array.from({ length: SLOTS }, (_, i) => existingImageUrls[i] ?? "");
        nextUrls[index] = downloadUrl;
        onUrlsUpdated(nextUrls);
      } catch (err) {
        console.error("Error uploading file:", err);
        // Optional: rollback preview on failure
        setImagePreviews((prev) => {
          revokeIfBlob(prev[index]);
          const next = [...prev];
          next[index] = existingImageUrls[index] ?? "";
          return next;
        });
      } finally {
        setUploading(false);
        // Clear input so same file can be picked again later if needed
        if (fileInputsRef.current[index]) fileInputsRef.current[index]!.value = "";
      }
    },
    [existingImageUrls, onUrlsUpdated]
  );

  const handleDelete = useCallback(
    (index: number) => {
      // Clean local preview if it’s a blob
      setImagePreviews((prev) => {
        revokeIfBlob(prev[index]);
        const next = [...prev];
        next[index] = "";
        return next;
      });

      // Let parent handle its own URL state (could also emit cleared urls here)
      onDelete(index);
    },
    [onDelete]
  );

  return (
    <div className="image-upload-container">
      {Array.from({ length: SLOTS }).map((_, index) => (
        <div key={index} className="image-upload-placeholder">
          {imagePreviews[index] ? (
            <div className="imagCnt">
              <img
                src={imagePreviews[index]}
                alt={`Preview ${index + 1}`}
                className="image-preview"
              />
              <button
                type="button"
                className="delete-button"
                onClick={() => handleDelete(index)}
                aria-label={`Delete image ${index + 1}`}
                disabled={uploading}
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="image-upload-icon"
              onClick={() => handlePickFile(index)}
              disabled={uploading}
              aria-label={`Upload image ${index + 1}`}
            >
              +
            </button>
          )}

          <input
            ref={(el) => (fileInputsRef.current[index] = el)}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, index)}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageComponent;
