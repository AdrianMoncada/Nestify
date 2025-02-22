import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SelectionScreen from './pages/SelectionScreen/SelectionScreen';
import TimerScreen from './pages/TimerScreen/TimerScreen';
import RewardScreen from './pages/RewardScreen/RewardScreen';
import {RewardState} from '../src/types/session-types';

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        // Check for unviewed rewards first
        const rewardStorage = await chrome.storage.local.get(['rewardState']);
        const savedReward = rewardStorage.rewardState as RewardState;

        if (savedReward && !savedReward.viewed) {
          setInitialRoute('/reward');
        } else {
          // If no unviewed rewards, check for active timer
          const timerStorage = await chrome.storage.local.get(['timerState']);
          const savedTimer = timerStorage.timerState;

          if (savedTimer) {
            setInitialRoute('/timer');
          } else {
            setInitialRoute('/');
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking app state:', error);
        setInitialRoute('/');
        setIsLoading(false);
      }
    };

    checkAppState();
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
        <Route path="/reward" element={<RewardScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
}
