import React from 'react';
import './BottomActionBar.css';

/**
 * BottomActionBar - three actions: Call, Activate Alarm, Video
 * Props: onCall, onActivate, onVideo
 */
export default function BottomActionBar({ onCall, onActivate, onVideo }) {
  return (
    <div className="bottomBar">
      <button className="bottomBar-btn" onClick={onCall}>
        <span className="icon">📞</span>
        <span>Call</span>
      </button>
      <button className="bottomBar-btn primary" onClick={onActivate}>
        <span className="icon">⚠️</span>
        <span>Activate Alarm</span>
      </button>
      <button className="bottomBar-btn" onClick={onVideo}>
        <span className="icon">🎥</span>
        <span>Video</span>
      </button>
    </div>
  );
}
