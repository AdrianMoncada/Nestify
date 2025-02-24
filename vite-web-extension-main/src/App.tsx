import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SelectionScreen from './pages/SelectionScreen/SelectionScreen';
import TimerScreen from './pages/TimerScreen/TimerScreen';
import RewardScreen from './pages/RewardScreen/RewardScreen';
import LoginScreen from './pages/LoginScreen/LoginScreen';
import { supabase } from './lib/supabase';

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAppState = async () => {
      const startTime = performance.now();
      
      try {
        // Primero verificamos si hay un estado cacheado reciente
        const { appState } = await chrome.runtime.sendMessage({ type: 'GET_APP_STATE' });
        
        if (appState && (Date.now() - appState.lastCheck < 5 * 60 * 1000)) {
          // Si hay estado cacheado y es reciente (menos de 5 minutos), lo usamos
          setIsAuthenticated(appState.isAuthenticated);
          
          if (!appState.isAuthenticated) {
            setInitialRoute('/login');
          } else if (appState.hasUnviewedReward) {
            setInitialRoute('/reward');
          } else if (appState.hasActiveTimer) {
            setInitialRoute('/timer');
          } else {
            setInitialRoute('/');
          }
        } else {
          // Si no hay estado cacheado o es viejo, hacemos una verificación completa
          const { session } = await chrome.storage.local.get('session');
          
          if (session) {
            const { error: supaAuthError } = await supabase.auth.setSession(session);
            
            if (!supaAuthError) {
              setIsAuthenticated(true);
              
              // Verificar estados en paralelo
              const [rewardState, timerState] = await Promise.all([
                chrome.storage.local.get(['rewardState']),
                chrome.storage.local.get(['timerState'])
              ]);
              
              // Determinar la ruta inicial basada en los estados
              if (rewardState?.rewardState && !rewardState.rewardState.viewed) {
                setInitialRoute('/reward');
              } else if (timerState?.timerState) {
                setInitialRoute('/timer');
              } else {
                setInitialRoute('/');
              }
              
              // Actualizar el estado en el worker
              await chrome.runtime.sendMessage({ 
                type: 'UPDATE_APP_STATE',
                state: {
                  isAuthenticated: true,
                  hasUnviewedReward: rewardState?.rewardState?.viewed === false,
                  hasActiveTimer: !!timerState?.timerState,
                  lastCheck: Date.now()
                }
              });
            } else {
              setInitialRoute('/login');
            }
          } else {
            setInitialRoute('/login');
          }
        }
      } catch (error) {
        console.error('Error checking app state:', error);
        setInitialRoute('/login');
      }
      
      setIsLoading(false);
      console.log(`Time taken: ${performance.now() - startTime}ms`);
    };

    checkAppState();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-[#784E2F] text-xl">
        Loading...
      </div>
    );
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
