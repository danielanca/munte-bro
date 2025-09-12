import React, { useState } from "react";
import { steps } from "./Steps";
import parse from "html-react-parser";
import './style.css';
import logo from '/assets/images/instructions/logo.png';

const Allsteps: React.FC = () => {
  const [formStepsNum, setFormStepsNum] = useState(0);

  const scrollToTop = () => {
    const formElement = document.getElementById('mainarea1');
    if (formElement) {
      formElement.scrollTop = 0; 
    }
  };
  
  const handleNext = () => {
    if (formStepsNum < steps.length - 1) {
      setFormStepsNum(formStepsNum + 1);
      scrollToTop();
    }
  };

  const handlePrev = () => {
    if (formStepsNum > 0) {
      setFormStepsNum(formStepsNum - 1);
      scrollToTop();
    }
  };

  return (
    <div className="form" id="mainarea">
    <div className="logo text-center">
      <img src={logo} alt="logo" />
    </div>
  
    <div className="form-content" id="mainarea1">
      {steps.map((step, index) => (
        <div
          key={step.stepNumber}
          className={`form-step ${index === formStepsNum ? 'active' : ''}`}
        >
          {step.content}
        </div>
      ))}
    </div>
  
    <div className="btn-group">
      {formStepsNum === 0 ? (
        <a className="btn btn-first" onClick={handleNext}>
          Să începem!
        </a>
      ) : (
        <>
          {formStepsNum > 0 && (
            <button className="btn btn-prev" onClick={handlePrev}>
              Înapoi
            </button>
          )}
          <div className="steps-indicator">
            {formStepsNum + 1}/{steps.length}
          </div>
          {formStepsNum < steps.length - 1 ? (
            <button className="btn btn-next" onClick={handleNext}>
              Înainte
            </button>
          ) : (
            <button className="btn btn-complete"></button>
          )}
        </>
      )}
    </div>
  </div>
  
  );
};

export default Allsteps;
