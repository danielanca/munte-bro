// @ts-nocheck

import React, { useState, useEffect } from "react";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "./ImagesComponent.css";

interface ImageComponentProps {
  existingImageUrls?: string[];
  onUrlsUpdated: (newUrls: string[]) => void;
  onDelete: (index: number) => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ existingImageUrls = [], onUrlsUpdated, onDelete }) => {
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState(existingImageUrls);

  useEffect(() => {
    setImagePreviews(existingImageUrls);
  }, [existingImageUrls]);

  const handleFileUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const storage = getStorage();
    const uniqueFileName = `${uuidv4()}_${file.name}`;
    const fileRef = storageRef(storage, `reviewsMedia/${uniqueFileName}`);
    const filePreview = URL.createObjectURL(file);

    let newImagePreviews = [...imagePreviews];
    newImagePreviews[index] = filePreview;
    setImagePreviews(newImagePreviews);

    try {
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      let newUrls = [...existingImageUrls];
      newUrls[index] = url;
      onUrlsUpdated(newUrls);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      {[0, 1, 2].map((index) => (
        <div key={index} className="image-upload-placeholder">
          {imagePreviews[index] ? (
            <div className="imagCnt">
              <img src={imagePreviews[index]} alt="Preview" className="image-preview" />
              <button className="delete-button" onClick={() => onDelete(index)}>
                X
              </button>
            </div>
          ) : (
            <div className="image-upload-icon" onClick={() => document.getElementById(`fileUpload-${index}`).click()}>
              +
            </div>
          )}
          <input
            type="file"
            id={`fileUpload-${index}`}
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
