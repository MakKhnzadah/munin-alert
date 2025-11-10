import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivateAlarmPage.css';
import LogoBlock from '../../components/Shared/LogoBlock';
import AlarmButton from '../../components/Shared/AlarmButton';
import { useAlarm } from '../../context/AlarmContext';

/**
 * ActivateAlarmPage
 * Matches the mockup: logo at top (provided by Navbar globally),
 * big red hold-to-activate button and instruction text.
 */
export default function ActivateAlarmPage() {
  const navigate = useNavigate();

  const { startCountdown } = useAlarm();

  const handleActivate = () => {
    startCountdown(10);
    navigate('/alarm/countdown');
  };

  return (
    <div className="alarmActivate-wrapper">
      <div className="alarmActivate-header">
        <h1>Activate Alarm</h1>
      </div>

      <div className="alarmActivate-center">
  <AlarmButton label="" holdSeconds={5} onActivate={handleActivate} />
      </div>

      <p className="alarmActivate-instruction">
        Press and hold for 5 seconds to send an alarm
      </p>

      <LogoBlock />
    </div>
  );
}
