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

          // Siempre redirigimos a TimerScreen si hay un timer guardado
          // TimerScreen se encargará de verificar si ha expirado y
          // redirigir a RewardScreen cuando sea necesario
          setInitialRoute('/timer');
          
          // No eliminar el timerState aquí - dejamos que TimerScreen lo maneje
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
    return <div className="flex h-screen items-center justify-center text-[#784E2F] text-xl">
      Loading...
    </div>;
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
