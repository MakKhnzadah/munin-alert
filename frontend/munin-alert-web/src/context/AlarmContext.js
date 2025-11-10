import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Alarm states:
 * idle -> holding -> countdown -> dispatched -> cancelled
 */
const AlarmContext = createContext();

export function AlarmProvider({ children }) {
  const [state, setState] = useState('idle');
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  const beginHold = useCallback(() => setState('holding'), []);
  const cancelHold = useCallback(() => setState('idle'), []);
  const startCountdown = useCallback((seconds = 10) => {
    setCountdownSeconds(seconds);
    setState('countdown');
  }, []);
  const markDispatched = useCallback(() => setState('dispatched'), []);
  const cancelAlarm = useCallback(() => setState('cancelled'), []);
  const reset = useCallback(() => setState('idle'), []);

  return (
    <AlarmContext.Provider value={{ state, countdownSeconds, beginHold, cancelHold, startCountdown, markDispatched, cancelAlarm, reset }}>
      {children}
    </AlarmContext.Provider>
  );
}

export const useAlarm = () => useContext(AlarmContext);
