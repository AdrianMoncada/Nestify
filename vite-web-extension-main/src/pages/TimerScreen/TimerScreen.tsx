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
import { mockDb, Ecosystem } from "../../mockDatabase/mock-database";
import { FloatingHeader } from "../../components/FloatingHeader/floating-header";

interface TimerStorage {
  startTime: number;
  totalDuration: number;
  selectedBird: any;
  selectedAction: string;
  selectedTime: number;
  isRunning: boolean;
}

const TimerScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const session: SessionState = state;

  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showRain, setShowRain] = useState(false);
  const [ecosystem, setEcosystem] = useState<Ecosystem | null>(null);
  const [currentTimerState, setCurrentTimerState] = useState<TimerStorage | null>(null);
  const { setCloudsMoving } = useCloudAnimation();

  // Initialize or restore timer state
  useEffect(() => {
    const initializeTimer = async () => {
      try {
        const storage = await chrome.storage.local.get(['timerState']);
        const savedTimer: TimerStorage = storage.timerState;

        if (savedTimer) {
          // Calculate remaining time based on saved state
          const currentTime = new Date().getTime();
          const elapsedSeconds = Math.floor((currentTime - savedTimer.startTime) / 1000);
          const remainingSeconds = savedTimer.totalDuration - elapsedSeconds;

          if (remainingSeconds <= 0) {
            // Timer has expired while extension was closed
            await handleSessionComplete();
          } else {
            // Restore timer state
            setTimeLeft(remainingSeconds);
            setIsRunning(savedTimer.isRunning);
            setCurrentTimerState(savedTimer);
          }
        } else if (session) {
          // Initialize new timer
          const newTimerState: TimerStorage = {
            startTime: new Date().getTime(),
            totalDuration: session.selectedTime * 1,
            selectedBird: session.selectedBird,
            selectedAction: session.selectedAction,
            selectedTime: session.selectedTime,
            isRunning: true
          };

          await chrome.storage.local.set({ timerState: newTimerState });
          setTimeLeft(newTimerState.totalDuration);
          setCurrentTimerState(newTimerState);
          setIsRunning(true);
        }
      } catch (error) {
        console.error('Error initializing timer:', error);
      }
    };

    initializeTimer();
  }, []);

  // Load ecosystem data
  useEffect(() => {
    const loadEcosystem = async () => {
      try {
        const eco = await mockDb.getEcosystem("user1");
        setEcosystem(eco);
      } catch (error) {
        console.error('Error loading ecosystem:', error);
      }
    };
    loadEcosystem();
  }, []);

  // Handle timer completion
  const handleSessionComplete = async () => {
    try {
      // Clear timer state
      await chrome.storage.local.remove(['timerState']);
      setIsRunning(false);

      // Create session outcome without using mockDb for timer state
      const sessionData = {
        user_id: "user1",
        completed: true,
        cancelled: false,
        duration: currentTimerState?.selectedTime || 0,
        specie_id: currentTimerState?.selectedBird?.id,
        action: currentTimerState?.selectedAction,
        start_time: new Date(currentTimerState?.startTime || 0)
      };

      // Only use mockDb for the final outcome
      const completedSession = await mockDb.createSession(sessionData);
      const sessionOutcome = await mockDb.createSessionOutcome(completedSession);

      // Navigate to reward screen
      navigate('/reward', { 
        state: { 
          outcome: sessionOutcome,
          session: completedSession
        }
      });
    } catch (error) {
      console.error('Error completing session:', error);
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

  // Handle session cancellation
  const handleSessionCancel = async () => {
    try {
      // Clear timer state
      await chrome.storage.local.remove(['timerState']);
      
      // Create cancelled session record
      const sessionData = {
        user_id: "user1",
        completed: false,
        cancelled: true,
        duration: currentTimerState?.selectedTime || 0,
        specie_id: currentTimerState?.selectedBird?.id,
        action: currentTimerState?.selectedAction,
        start_time: new Date(currentTimerState?.startTime || 0)
      };

      // Only use mockDb for the final record
      await mockDb.createSession(sessionData);
      
      setIsRunning(false);
      setShowModal(false);
      setShowRain(false);
      setCloudsMoving(true);
      navigate('/');
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  // Render the appropriate animation
  const renderAnimation = () => {
    const action = currentTimerState?.selectedAction || session?.selectedAction;
    
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

  // Get current session info for display
  const displayState = currentTimerState || session;

  return (
    <div className="flex flex-col h-screen">
      {ecosystem && (
        <FloatingHeader
          stats={{
            nests: ecosystem.nests,
            population: ecosystem.population,
            feathers: ecosystem.feathers,
            resources: ecosystem.resources,
          }}
        />
      )}

      <div className="relative z-10 flex items-center justify-center gap-6 p-4 mx-4 mt-4 bg-white/80 rounded-2xl">
        <Tooltip content={displayState?.selectedBird?.tooltip || "Bird"}>
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            <Bird size={20} />
            <span>{displayState?.selectedBird?.name || "Bird"}</span>
          </div>
        </Tooltip>
        <Tooltip content="Current Action">
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            {displayState?.selectedAction === 'Hatch' ? <Egg size={20} /> : 
             displayState?.selectedAction === 'Build' ? <House size={20} /> :
             <Leaf size={20} />}
            <span>{displayState?.selectedAction || "Action"}</span>
          </div>
        </Tooltip>
        <Tooltip content="Minutes for focus session">
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            <Clock size={20} />
            <span>{Math.ceil(timeLeft / 60)}</span>
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
              <button
                onClick={handleSessionCancel}
                className="px-6 py-2 text-white rounded-full bg-[#ED834D] shadow-[0_6px_0_0_#CA6F41] hover:brightness-110 active:shadow-[0_0px_0_0_#CA6F41] active:translate-y-[6px] transition-all duration-75"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setCloudsMoving(true);
                  setShowRain(false);
                }}
                className="px-6 py-2 text-[#784E2F] rounded-full bg-[#DED75A] shadow-[0_6px_0_0_#98A64F] hover:brightness-110 active:shadow-[0_0px_0_0_#98A64F] active:translate-y-[6px] transition-all duration-75"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerScreen;