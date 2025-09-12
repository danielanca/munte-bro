import React, { useEffect, useState } from "react";
import validator from "validator";
import styles from "./AddReview.module.scss";
import { sendReviewToBack } from "../../../../services/emails";
import { storage } from '../../../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
interface ReviewProps {
  name: string;
  email: string;
  reviewActual: string;
  reviewProductID: string;
  starsNumber: string;
  mediaLink?: string;
}
interface PassingReview {
  productID: string;
}

const AddReview = ({ productID }: PassingReview) => {
  const [image, setImage] = useState<any>(null);
  const [openReviewComment, setOpenReviewComment] = useState(false);
  const [reviewBuffer, setReviewBuffer] = useState<ReviewProps>({
    reviewProductID: productID,
    name: "",
    starsNumber: "",
    reviewActual: "",
    email: "",
    mediaLink: ""
  });
  const [reviewStatus, setReviewStatus] = useState("NOT_SENT");
  const [reviewState, setReviewState] = useState<"pressed" | "pending" | "init" | "invalidInput">("init");

  const reviewInputer = (data: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = data.target;
    setReviewBuffer((reviewBuffer) => ({
      ...reviewBuffer,
      [name]: value
    }));
  };
  const identificationInserter = (data: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = data.target;
    setReviewBuffer((reviewBuffer) => ({
      ...reviewBuffer,
      [name]: value
    }));
  };
  const handleUploadChange = (e:any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (reviewState === "invalidInput") {
      setReviewState("init");
    }
  }, [reviewBuffer]);

  useEffect(() => {
    if (reviewState === "pressed") {
      if (!validator.isEmail(reviewBuffer.email) || reviewBuffer.reviewActual === "" || reviewBuffer.name === "") {
        setReviewState("invalidInput");
      } else {
        setReviewState("pending");
        submitReviewToServer();
      }
    }
  }, [reviewState]);

  const onReviewButtonClick = () => {
    setReviewState("pressed");
  };

  const submitReviewToServer = () => {
    if (image != null) {
      const storageRef = ref(storage, `/reviewsMedia/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setReviewBuffer((reviewBuffer) => ({ ...reviewBuffer, mediaLink: url }));
          });
        }
      );
    } else {
      sendReviewToBack(reviewBuffer).then((response) =>
        response.json().then((responseInside:any) => {
          if (responseInside.response === "SENT") {
            setReviewStatus(responseInside.response);
          }
        })
      );
    }
  };
  useEffect(() => {
    if (reviewBuffer.mediaLink !== "") {
      sendReviewToBack(reviewBuffer).then((response) =>
        response.json().then((responseInside:any) => {
          if (responseInside.response === "SENT") {
            setReviewStatus(responseInside.response);
          }
        })
      );
    }
  }, [reviewBuffer.mediaLink]);
  const openReviewContainer = () => {
    setOpenReviewComment(true);
  };
  return (
    <div className={styles.addSection}>
      {!openReviewComment && (
        <button onClick={openReviewContainer} className={styles.addReviewButton}>
          {"SCRIE REVIEW"}
        </button>
      )}

      <div className={openReviewComment ? styles.activeTransition : styles.wrapper}>
        {reviewStatus === "NOT_SENT" ? (
          <>
            <div className={styles.inputContainer}>
              <span>{"Recenzia:"}</span>
              <textarea
                spellCheck="false"
                rows={5}
                onChange={reviewInputer}
                className={styles.textarea}
                name="reviewActual"
                id="reviewActual"
                placeholder="Introduceti mesajul cu privire la experienta dvs. "
              />
              {/* <button onClick={handleUpload}>{"Uploadv"}</button> */}
              <span>{"Numele dvs:"}</span>
              <input onChange={identificationInserter} name="name" id="name" placeholder="Nume*" />
              <span>{"Email:"}</span>
              <input onChange={identificationInserter} name={"email"} id="email" placeholder="Email:*" />
              <span>{"Media:"}</span>
              <div className={styles.fileUploadContainer}>
                <input
                  className={styles.inputTypeFile}
                  onChange={handleUploadChange}
                  type="file"
                  name={"media"}
                  id="media"
                  placeholder="Poza:"
                />
              </div>
            </div>
            <button
              onClick={onReviewButtonClick}
              className={reviewState === "pending" ? styles.pendingSubmitButton : styles.submitButton}
            >
              {reviewState === "init" ? "TRIMITE" : "..."}
            </button>
            {reviewState === "pending" && <p>{"Se trimite recenzia..."}</p>}
            {reviewState === "invalidInput" && <p>{"Datele introduse nu sunt valide"}</p>}
          </>
        ) : reviewStatus === "SENT" ? (
          <h2>{"Recenzia a fost trimisa"}</h2>
        ) : (
          <h2>{"NOTHING HERE"}</h2>
        )}
      </div>
    </div>
  );
};

export default AddReview;
