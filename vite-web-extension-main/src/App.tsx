import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SelectionScreen from './pages/SelectionScreen/SelectionScreen';
import TimerScreen from './pages/TimerScreen/TimerScreen';
import RewardScreen from './pages/RewardScreen/RewardScreen';

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTimerState = async () => {
      try {
        const storage = await chrome.storage.local.get(['timerState']);
        const savedTimer = storage.timerState;

        if (savedTimer) {
          const currentTime = new Date().getTime();
          const elapsedSeconds = Math.floor((currentTime - savedTimer.startTime) / 1000);
          const remainingSeconds = savedTimer.totalDuration - elapsedSeconds;

          if (remainingSeconds > 0 && savedTimer.isRunning) {
            setInitialRoute('/timer');
          } else {
            setInitialRoute('/');
            // Limpiar el estado si el timer ha expirado
            await chrome.storage.local.remove(['timerState']);
          }
        } else {
          setInitialRoute('/');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking timer state:', error);
        setInitialRoute('/');
        setIsLoading(false);
      }
    };

    checkTimerState();
  }, []);

  if (isLoading) {
    return null; // O un componente de loading si lo prefieres
  }

  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<SelectionScreen />} />
        <Route path="/timer" element={<TimerScreen />} />
        <Route path="/reward" element={<RewardScreen/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
}
