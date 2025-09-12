import React from 'react';

const Timer = () => {
  return (
    <div className="timer-container">
      <div className="timer-display">
        <div className="time-block">
          <div className="time-row" id="hours">
            <div className="digit">0</div>
            <div className="digit">0</div>
          </div>
          <span className="time-labels">ORE</span>
        </div>
        <span className="separator">:</span>
        <div className="time-block">
          <div className="time-row" id="minutes">
            <div className="digit">0</div>
            <div className="digit">0</div>
          </div>
          <span className="time-labels">MIN</span>
        </div>
        <span className="separator">:</span>
        <div className="time-block">
          <div className="time-row" id="seconds">
            <div className="digit">0</div>
            <div className="digit">0</div>
          </div>
          <span className="time-labels">SEC</span>
        </div>
      </div>
      <button className="start-button" id="startTimer">
        Start Cronometru
      </button>
    </div>
  );
}

export default Timer;
