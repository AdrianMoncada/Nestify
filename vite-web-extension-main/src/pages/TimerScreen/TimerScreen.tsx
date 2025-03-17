import React, { useEffect, useState } from "react";
import { Bird, Clock, Egg, House, Leaf } from "lucide-react";
import { Tooltip } from "../../components/Tooltip/tooltip-component";
import { useCloudAnimation } from '../../context/CloudAnimationContext';
import { Button } from '../../components/button/Button';
import { SessionState } from '../../types/session-types';
import { EggAnimation } from '../../assets/animations/EggAnimation';
import { BuildAnimation } from '../../assets/animations/BuildAnimation';
import { AnimatedBird } from '../../assets/animations/animated-bird'; 
import { useNavigate, useLocation } from "react-router-dom";
import { FloatingHeader } from "../../components/FloatingHeader/floating-header";
import { backendService } from "../../services/backend-service";
import ProcessingRewardsModal from "../../components/ProcessingRewardsModal/ProcessingRewardsModal"; // Import the modal


interface Ecosystem {
  id: string; // uuid
  user_id: string; // uuid
  nests: number;
  population: number;
  max_population: number;
  feathers: number;
  resources: number;
}

interface TimerStorage {
  startTime: number;
  totalDuration: number;
  selectedBird: any;
  selectedAction: string;
  selectedTime: number;
  isRunning: boolean;
}

const TimerScreen: React.FC = () => {
  console.log("ingresa a timerscreen!")
  const navigate = useNavigate();
  const { state } = useLocation();
  const session: SessionState = state;

  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showRain, setShowRain] = useState(false);
  const [ecosystem, setEcosystem] = useState<Ecosystem | null>(null);
  const [currentTimerState, setCurrentTimerState] = useState<TimerStorage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCloudsMoving } = useCloudAnimation();
  const [processingRewards, setProcessingRewards] = useState(false); // Add state for processing rewards modal

  // Default values to prevent undefined errors
  const DEFAULT_ACTION = "Focus";
  const DEFAULT_BIRD = { id: "default", name: "Bird", tooltip: "Default Bird" };

  // Initialize or restore timer state
  useEffect(() => {
    const initializeTimer = async () => {
      try {
        setIsLoading(true);
        const storage = await chrome.storage.local.get(['timerState']);
        const savedTimer: TimerStorage = storage.timerState;

        if (savedTimer) {
          // Calculate remaining time based on saved state
          const currentTime = new Date().getTime();
          const elapsedSeconds = Math.floor((currentTime - savedTimer.startTime) / 1000);
          const remainingSeconds = savedTimer.totalDuration - elapsedSeconds;

          // Ensure savedTimer has valid action and bird
          if (!savedTimer.selectedAction) savedTimer.selectedAction = DEFAULT_ACTION;
          if (!savedTimer.selectedBird) savedTimer.selectedBird = DEFAULT_BIRD;

          if (remainingSeconds <= 0) {
            // Timer has expired while extension was closed
            await handleExpiredTimer(savedTimer);
          } else {
            // Restore timer state
            setTimeLeft(remainingSeconds);
            setIsRunning(savedTimer.isRunning);
            setCurrentTimerState(savedTimer);
            
            // Update app state to ensure consistency
            await chrome.runtime.sendMessage({ 
              type: 'UPDATE_APP_STATE',
              state: {
                isAuthenticated: true,
                hasUnviewedReward: false,
                hasActiveTimer: true,
                lastCheck: Date.now()
              }
            });
          }
        } else if (session) {
          // Initialize new timer
          const newTimerState: TimerStorage = {
            startTime: new Date().getTime(),
            // Update to test flow timer app
            totalDuration: session.selectedTime * 60,
            selectedBird: session.selectedBird || DEFAULT_BIRD,
            selectedAction: session.selectedAction || DEFAULT_ACTION,
            selectedTime: session.selectedTime,
            isRunning: true
          };

          await chrome.storage.local.set({ timerState: newTimerState });
          setTimeLeft(newTimerState.totalDuration);
          setCurrentTimerState(newTimerState);
          setIsRunning(true);
          
          // Update app state
          await chrome.runtime.sendMessage({ 
            type: 'UPDATE_APP_STATE',
            state: {
              isAuthenticated: true,
              hasUnviewedReward: false,
              hasActiveTimer: true,
              lastCheck: Date.now()
            }
          });
        } else {
          // No timer state and no session - redirect to home
          navigate('/');
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing timer:', error);
        setError('Error initializing timer. Please try again.');
        setIsLoading(false);
      }
    };

    initializeTimer();
  }, []);

  const handleExpiredTimer = async (savedTimer: TimerStorage) => {
    try {
      // Clear timer state
      await chrome.storage.local.remove(['timerState']);
      setIsRunning(false);
  
      // Show processing rewards modal
      setProcessingRewards(true);
  
      // Get the session ID from storage
      const { sessionId } = await chrome.storage.local.get('sessionId');
      
      if (!sessionId) {
        throw new Error('No active session found');
      }

      // Update session status, which triggers outcomes processing
      const result = await backendService.updateSessionStatus(sessionId, 'completed');
  
      // Hide processing rewards modal
      setProcessingRewards(false);

      const rewardState = {
        outcome: result.session_outcomes,
        session: { completed: true, action: currentTimerState?.selectedAction },
        viewed: false,
        updatedEcosystem: result.updated_ecosystem
      };
  
      // Almacenar el estado de recompensa antes de navegar
      await chrome.storage.local.set({ rewardState, ecosystem: result.updated_ecosystem });
      
      // Update app state
      await chrome.runtime.sendMessage({ 
        type: 'UPDATE_APP_STATE',
        state: {
          isAuthenticated: true,
          hasUnviewedReward: true,
          hasActiveTimer: false,
          lastCheck: Date.now()
        }
      });
  
      // Navigate to reward screen with the necessary data
      navigate('/reward', { 
        state: { 
          outcome: result.session_outcomes,
          session: { 
            completed: true, 
            action: currentTimerState?.selectedAction?.toLowerCase() || "gather" 
          },
          updatedEcosystem: result.updated_ecosystem
        }
      });
    } catch (error) {
      // Hide processing rewards modal on error
      setProcessingRewards(false);
      console.error('Error handling expired timer:', error);
      setError('Failed to process completed session');
      navigate('/');
    }
  };

  // Load ecosystem data
  useEffect(() => {
    const loadEcosystem = async () => {
      console.log("loadEcosystem beep")
      try {
        const { ecosystem } = await chrome.storage.local.get(['ecosystem']);
        console.log("ecosystem data:", ecosystem);  // Directly log the ecosystem object
        setEcosystem(ecosystem);
      } catch (error) {
        console.error('Error loading ecosystem:', error);
        setError('Failed to load ecosystem data');
      }
    };
    loadEcosystem();
  }, []);

  const handleSessionComplete = async () => {
    try {
      // Clear timer state
      await chrome.storage.local.remove(['timerState']);
      setIsRunning(false);
  
      // Show processing rewards modal
      setProcessingRewards(true);
  
      // Get the session ID from storage
      const { sessionId } = await chrome.storage.local.get('sessionId');
      
      if (!sessionId) {
        throw new Error('No active session found');
      }
  
      // Update session status, which triggers outcomes processing
      const result = await backendService.updateSessionStatus(sessionId, 'completed');
  
      // Hide processing rewards modal
      setProcessingRewards(false);

      // Save reward state before navigation
      const rewardState = {
        outcome: result.session_outcomes,
        session: { completed: true, action: currentTimerState?.selectedAction },
        viewed: false,
        updatedEcosystem: result.updated_ecosystem
      };
      
      console.log(rewardState);
      // Almacenar el estado de recompensa antes de navegar
      await chrome.storage.local.set({ rewardState, ecosystem: result.updated_ecosystem });
      
      // Update app state
      await chrome.runtime.sendMessage({ 
        type: 'UPDATE_APP_STATE',
        state: {
          isAuthenticated: true,
          hasUnviewedReward: true,
          hasActiveTimer: false,
          lastCheck: Date.now()
        }
      });
  
      navigate('/reward', { 
        state: { 
          outcome: result.session_outcomes,
          session: { 
            completed: true, 
            action: currentTimerState?.selectedAction?.toLowerCase() || "gather" 
          },
          updatedEcosystem: result.updated_ecosystem
        }
      });
    } catch (error) {
      // Hide processing rewards modal on error
      setProcessingRewards(false);
      console.error('Error completing session:', error);
      setError('Failed to process completed session');
      navigate('/');
    }
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            if (timer) clearInterval(timer);
            handleSessionComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const handleSessionCancel = async () => {
    try {
      // Clear timer state
      await chrome.storage.local.remove(['timerState']);
      
      // Get the session ID from storage
      const { sessionId } = await chrome.storage.local.get('sessionId');
      
      if (!sessionId) {
        throw new Error('No active session found');
      }
  
      // Cancel the session using the backend service
      await backendService.updateSessionStatus(sessionId, "cancelled");
      
      // Update app state
      await chrome.runtime.sendMessage({ 
        type: 'UPDATE_APP_STATE',
        state: {
          isAuthenticated: true,
          hasUnviewedReward: false,
          hasActiveTimer: false,
          lastCheck: Date.now()
        }
      });
      
      setIsRunning(false);
      setShowModal(false);
      setShowRain(false);
      setCloudsMoving(true);
      navigate('/');
    } catch (error) {
      console.error('Error cancelling session:', error);
      setError('Failed to cancel session');
    }
  };

  // Render the appropriate animation
  const renderAnimation = () => {
    const action = currentTimerState?.selectedAction || session?.selectedAction || DEFAULT_ACTION;
    
    switch (action) {
      case 'Hatch':
        return <EggAnimation />;
      case 'Build':
        return <BuildAnimation />;
      default:
        return <AnimatedBird />;
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleStopClick = () => {
    setShowModal(true);
    setCloudsMoving(false);
    setShowRain(true);
  };

  // Get current session info for display with safe defaults
  const displayState = currentTimerState || session || {
    selectedBird: DEFAULT_BIRD,
    selectedAction: DEFAULT_ACTION,
    selectedTime: 0
  };

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <div className="text-[#784E2F] text-xl">Loading session...</div>
      </div>
    );
  }

  // Show error state if there was a problem
  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {ecosystem && (
        <FloatingHeader
          stats={{
            nests: ecosystem.nests,
            population: ecosystem.population,
            maxPopulation: ecosystem.max_population,
            feathers: ecosystem.feathers,
            resources: ecosystem.resources,
          }}
        />
      )}

      <div className="relative z-10 flex items-center justify-center gap-6 p-4 mx-4 mt-4 bg-white/80 rounded-2xl">
        <Tooltip position="bottom" content={displayState?.selectedBird?.tooltip || "Bird"}>
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            <Bird size={20} />
            <span>{displayState?.selectedBird?.name || "Bird"}</span>
          </div>
        </Tooltip>
        <Tooltip position="bottom" content="Current Action">
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            {displayState?.selectedAction === 'Hatch' ? <Egg size={20} /> : 
             displayState?.selectedAction === 'Build' ? <House size={20} /> :
             <Leaf size={20} />}
            <span>{displayState?.selectedAction || "Action"}</span>
          </div>
        </Tooltip>
        <Tooltip position="bottom" content="Minutes for focus session">
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            <Clock size={20} />
            <span>{displayState?.selectedTime}</span>
          </div>
        </Tooltip>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative" style={{ width: "180px", height: "180px" }}>
          {renderAnimation()}
        </div>

        <div className="mt-8">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-[200px]">
              <span className="text-[#784E2F] text-7xl font-bold">{formattedTime}</span>
            </div>
            
            <div className="w-full">
              <Button variant="primary" onClick={handleStopClick} className="text-sm px-8">
                Stop Focus Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20"
          onClick={() => {
            setShowModal(false);
            setCloudsMoving(true);
            setShowRain(false);
          }}
        >
          <div
            className="p-6 bg-white rounded-lg shadow-lg mx-4 border-2 border-[#784E2F]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-6 text-lg text-[#784E2F] text-center">
              Are you sure you want to cancel your focus session?
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="negative" className="text-sm px-8"
                onClick={handleSessionCancel}
              >
                Yes
              </Button>
              <Button variant="positive" className="text-sm px-8"
                onClick={() => {
                  setShowModal(false);
                  setCloudsMoving(true);
                  setShowRain(false);
                }}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add the ProcessingRewardsModal component */}
      <ProcessingRewardsModal isVisible={processingRewards} />
    </div>
  );
};

export default TimerScreen;