import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SelectionScreen from './pages/SelectionScreen/SelectionScreen';
import TimerScreen from './pages/TimerScreen/TimerScreen';
import RewardScreen from './pages/RewardScreen/RewardScreen';
import LoginScreen from './pages/LoginScreen/LoginScreen';
import { RewardState } from '../src/types/session-types';
import { supabase, getUserData } from './lib/supabase';

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        // Check authentication first
        const { session } = await chrome.storage.local.get('session');
        if (session) {
          const { error: supaAuthError } = await supabase.auth.setSession(session);
          if (!supaAuthError) {
            setIsAuthenticated(true);
            
            // Get and log user data
            const userData = await getUserData();
            if (userData) {
              console.log('User data:', userData);
            }

            // Check for unviewed rewards
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
          } else {
            setInitialRoute('/login');
          }
        } else {
          setInitialRoute('/login');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking app state:', error);
        setInitialRoute('/login');
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
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/"
          element={isAuthenticated ? <SelectionScreen /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/timer"
          element={isAuthenticated ? <TimerScreen /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/reward"
          element={isAuthenticated ? <RewardScreen /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
}
