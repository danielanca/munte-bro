import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, getDocs, query, deleteDoc } from "firebase/firestore";
import { db, storage } from "../../firebase"; // Firebase config
import styles from "./VideoUpload.module.css"; // Using CSS module

const VideoUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [showPage, setShowPage] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Mark handleUpload as async to allow the use of await
  const handleUpload = async () => {
    if (!file) return;

    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Clear previous video entry from Firestore
        const videoQuery = query(collection(db, "videos"));
        const querySnapshot = await getDocs(videoQuery);

        // Delete any existing video URLs
        for (const doc of querySnapshot.docs) {
          await deleteDoc(doc.ref); // Marking as async so 'await' can be used
        }

        // Add new video URL to Firestore
        await addDoc(collection(db, "videos"), {
          url: downloadURL,
          createdAt: new Date(),
        });

        setUploadSuccess(true); // Mark as success
        console.log("Video uploaded successfully. URL:", downloadURL);
      }
    );
  };

  const handleContinue = () => {
    // Reset the states to allow uploading a new video
    setFile(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    setShowPage(false);
  };

  return (
    <div className={styles.videoUploadContainer}>
      {!showPage ? (
        <>
          {!uploadSuccess ? (
            <>
              <input type="file" accept="video/*" onChange={handleFileChange} />
              <button onClick={handleUpload}>Upload Video</button>
              {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
            </>
          ) : (
            <div className={styles.uploadSuccess}>
              <p>Video uploaded successfully!</p>
              <button className={styles.continueButton} onClick={handleContinue}>
                Continue
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.pageContent}>
          <h2>Welcome to the next page!</h2>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
