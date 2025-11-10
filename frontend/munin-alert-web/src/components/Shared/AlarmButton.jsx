import React, { useEffect, useRef, useState } from 'react';
import './AlarmButton.css';

/**
 * AlarmButton - large circular button with hold-to-activate behavior.
 * Props:
 * - label: string shown below or inside (optional)
 * - holdSeconds: number of seconds to hold before firing (default 5)
 * - onActivate: callback when hold completes
 */
export default function AlarmButton({ label = 'Activate', holdSeconds = 5, onActivate }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => { clearInterval(timerRef.current); }, []);

  const startHold = () => {
    if (holding) return;
    setHolding(true);
    setProgress(0);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const pct = Math.min(100, (elapsed / holdSeconds) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current);
        setHolding(false);
        onActivate && onActivate();
      }
    }, 30);
  };

  const stopHold = () => {
    clearInterval(timerRef.current);
    setHolding(false);
    setProgress(0);
  };

  return (
    <div className="alarmBtn-wrap">
      <button
        className={`alarmBtn ${holding ? 'is-holding' : ''}`}
        onMouseDown={startHold}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={startHold}
        onTouchEnd={stopHold}
      >
        <div className="alarmBtn-core">!</div>
        <svg className="alarmBtn-progress" viewBox="0 0 120 120">
          <circle className="bg" cx="60" cy="60" r="54" />
          <circle
            className="fg"
            cx="60"
            cy="60"
            r="54"
            style={{ strokeDasharray: `${(339.292 * progress) / 100} 339.292` }}
          />
        </svg>
      </button>
      {label && <div className="alarmBtn-label">{label}</div>}
    </div>
  );
}
