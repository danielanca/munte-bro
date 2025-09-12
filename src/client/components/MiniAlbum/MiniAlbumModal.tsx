import React, { useRef, useState } from "react";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./minialbm.css";

interface ImageUploadModalProps {
  isOpen: boolean;
  toggle: () => void;
  myimages: { name: string; url: string }[];
  setmyImages: React.Dispatch<React.SetStateAction<{ name: string; url: string }[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onUploadComplete: () => void;
}

const MiniAlbumModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  toggle,
  myimages,
  setmyImages,
  loading,
  setLoading,
  onUploadComplete,
}) => {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [maxlimit, setmaxlimit] = useState(false);
  const MAX_IMAGES = 16;

  const selectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (myimages.length + files.length > MAX_IMAGES) {
      setmaxlimit(true);
      return;
    }
    setmaxlimit(false); 

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;

      if (!myimages.some(e => e.name === files[i].name)) {
        setmyImages(prevImages => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          },
        ]);
      }
    }
  };

  const deleteImage = (index: number) => {
    setmyImages(prevImages => prevImages.filter((_, i) => i !== index));
    setmaxlimit(false); 
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (myimages.length + files.length > MAX_IMAGES) {
      setmaxlimit(true);
      return;
    }
    setmaxlimit(false); 

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!myimages.some(e => e.name === files[i].name)) {
        setmyImages(prevImages => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          },
        ]);
      }
    }
  };

  const storeImagesInLocalStorage = () => {
    const minialbumImages = myimages.map((image) => ({
      url: image.url,
      name: image.name,
    }));
    localStorage.setItem("minialbumImages", JSON.stringify(minialbumImages));
  };

  const uploadminialbum = async () => {
    setLoading(true);
    storeImagesInLocalStorage();
    await new Promise(resolve => setTimeout(resolve, 2000));
    onUploadComplete();
    toggle();
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered className="modal-lg">
      <ModalBody>
        <div className="card">
          <div className="top">
            <p>Select Images For Mini Album
              <span className="maxlimit"> (Max 16 Images)</span></p>           
          </div>
          <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
            {isDragging ? (
              <span className="select">Drag image here</span>
            ) : (
              <>
                Drag & Drop image here or{" "}
                <span className="select" role="button" onClick={selectFiles}>
                  Browse
                </span>
              </>
            )}
            <input
              name="file"
              type="file"
              className="file"
              multiple
              ref={fileInputRef}
              onChange={onFileSelect}
              style={{ display: "none" }}
            />
          </div>
          <div className="container">
            {myimages.map((image, index) => (
              <div className="image" key={image.name || index}>
                <span className="delete" onClick={() => deleteImage(index)}>
                  &times;
                </span>
                <img src={image.url} alt={image.name} />
              </div>
            ))}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
        <Button
          className="minialbm-submit"
          onClick={uploadminialbum}
          disabled={loading || myimages.length === 0}
        >
          {loading ? <span>Uploading...</span> : "Upload"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MiniAlbumModal;
