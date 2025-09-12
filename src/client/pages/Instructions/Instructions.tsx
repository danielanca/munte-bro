import './Instrutions.scss';  // Import SCSS globally, no more need for CSS modules
import React, { useState, useEffect } from 'react';
import { steps } from './Steps';
import { getDocs, collection } from "firebase/firestore"; // Firestore import to get videos
import { db } from '../../firebase'; // Firebase config
import parse from 'html-react-parser';

const Instructions: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // State to store video URL
  const totalSteps = steps.length;

  useEffect(() => {
    const fetchVideo = async () => {
      if (currentStep === 11) {
        // Fetch video URL from Firestore
        try {
          const videoCollectionRef = collection(db, "videos");
          const videoSnapshot = await getDocs(videoCollectionRef);
          const videoData = videoSnapshot.docs[0]?.data(); // Assuming you want the first video
          if (videoData?.url) {
            setVideoUrl(videoData.url);
          }
        } catch (error) {
          console.error("Error fetching video:", error);
        }
      }
    };

    fetchVideo();
  }, [currentStep]);

  const goToNextStep = () => setCurrentStep((currentStep) => currentStep + 1);
  const goToPreviousStep = () => setCurrentStep((currentStep) => currentStep - 1);

  const renderCurrentStep = () => {
    const step = steps[currentStep - 1];

    if (currentStep === 11) {
      // Render video for step 11
      return (
        <div className="step-content">
          <h2 className="step-title">{step.title}</h2>
          <div className="video-container">
            <p>Urmăriți videoclipul de instrucțiuni pentru a vizualiza pașii detaliați.</p>
            {videoUrl ? (
              <video controls width="100%">
                <source src={videoUrl} type="video/mp4" />
                Browser-ul dumneavoastră nu suportă tag-ul video.
              </video>
            ) : (
              <p>Loading video...</p>
            )}
          </div>
        </div>
      );
    }

    // Render HTML content for other steps
    return (
      <div className="step-content">
        <h2 className="step-title">{step.title}</h2>
        <div className="htmlstyle">{parse(step.contentHTML)}</div>
      </div>
    );
  };

  const renderTopHeadline = () => {
    const step = steps[currentStep - 1];
    return (
      <span className="boxblack title">{parse(step.description)}</span>
    );
  };

  return (
    <div className="wizard-container">
      <div className="wizard-inner">
        <div className="logo-container">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/diniubire-89ce0.appspot.com/o/ProductMedia%2Fdiniubire_logo.png?alt=media&token=c798240e-c5ef-42a7-bc9a-fcc5df6afa63"
            alt="logo"
          />
        </div>
        <div className="step-indicator">
          {renderTopHeadline()}
          <span className="boxblack steps">
            Pas {currentStep}/{totalSteps}
          </span>
        </div>
        <div className="content">
          {renderCurrentStep()}
        </div>
        <div className="action-container">
          <button
            onClick={goToPreviousStep}
            className="previous"
            disabled={currentStep === 1}
          >
            INAPOI
          </button>
          <button
            onClick={goToNextStep}
            className="next"
            disabled={currentStep === totalSteps}
          >
            INAINTE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
