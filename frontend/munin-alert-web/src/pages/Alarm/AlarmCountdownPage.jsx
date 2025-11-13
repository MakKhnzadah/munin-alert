import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AlarmCountdownPage.css';
import LogoBlock from '../../components/Shared/LogoBlock';
import { useAlarm } from '../../context/AlarmContext';

/**
 * AlarmCountdownPage
 * Displays detected Emergency, countdown timer, and cancel button.
 * After countdown it would trigger final alert (placeholder hook).
 */
export default function AlarmCountdownPage() {
  const navigate = useNavigate();
  const { countdownSeconds, markDispatched, reset } = useAlarm();
  const START_SECONDS = countdownSeconds || 10;
  const [seconds, setSeconds] = useState(START_SECONDS);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(t);
          // Placeholder: finalize alarm dispatch here
          markDispatched();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const cancelAlarm = () => { reset(); navigate('/alarm'); };

  return (
    <div className="alarmCountdown-wrapper">
      <div className="alarmCountdown-card">
        <div className="alarmCountdown-alertTitle">Emergency Detected</div>
        <div className="alarmCountdown-alertSubtitle">Possible Fall or Crash</div>
      </div>
      <div className="alarmCountdown-timerText">
        {seconds > 0 ? `Sending alert in ${seconds} second${seconds === 1 ? '' : 's'}` : 'Dispatching alert...'}
      </div>
      <div className="alarmCountdown-note">location will be sent with the alert</div>
      <button className="alarmCountdown-cancelBtn" onClick={cancelAlarm}>Cancel Alarm</button>
      <LogoBlock />
    </div>
  );
}
