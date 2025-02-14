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
import { mockDb, Session, SessionOutcome, Ecosystem } from "../../mockDatabase/mock-database";
import { FloatingHeader } from "../../components/FloatingHeader/floating-header";

const TimerScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const session: SessionState = state;

  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(session.selectedTime * 1);
  const [isRunning, setIsRunning] = useState(true);
  const [showRain, setShowRain] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [ecosystem, setEcosystem] = useState<Ecosystem | null>(null);
  const { setCloudsMoving } = useCloudAnimation();

  // Load ecosystem data when component mounts
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

  // Create session when component mounts
  useEffect(() => {
    const createInitialSession = async () => {
      const newSession = await mockDb.createSession({
        user_id: "user1",
        specie_id: session.selectedBird.id,
        action: session.selectedAction,
        duration: session.selectedTime,
        completed: false,
        start_time: new Date(),
        cancelled: false
      });
      setCurrentSession(newSession);
    };

    createInitialSession();
  }, []);

  const renderAnimation = () => {
    switch (session.selectedAction) {
      case 'Hatch':
        return <EggAnimation />;
      case 'Build':
        return <BuildAnimation />;
      default:
        return <AnimatedBird />;
    }
  };

  // Function to handle session completion
  const handleSessionComplete = async () => {
    if (!currentSession) return;

    setIsRunning(false); // Stop the timer
    
    try {
      // Update session as completed
      const updatedSession = await mockDb.updateSession(currentSession.id, {
        completed: true,
        cancelled: false
      });

      if (updatedSession) {
        // Generate session outcome
        const sessionOutcome = await mockDb.createSessionOutcome(updatedSession);
        
        // Navigate to reward screen with the outcome
        navigate('/reward', { 
          state: { 
            outcome: sessionOutcome,
            session: updatedSession
          }
        });
      }
    } catch (error) {
      console.error('Error completing session:', error);
      // Handle error appropriately
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

  // Function to handle session cancellation
  const handleSessionCancel = async () => {
    if (!currentSession) return;

    try {
      // Update session as cancelled
      await mockDb.updateSession(currentSession.id, {
        completed: false,
        cancelled: true
      });
      
      setIsRunning(false);
      setShowModal(false);
      setShowRain(false);
      setCloudsMoving(true);
      navigate('/');
    } catch (error) {
      console.error('Error cancelling session:', error);
      // Handle error appropriately
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
        <Tooltip content={session.selectedBird.tooltip}>
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            <Bird size={20} />
            <span>{session.selectedBird.name}</span>
          </div>
        </Tooltip>
        <Tooltip content="Current Action">
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            {session.selectedAction === 'Hatch' ? <Egg size={20} /> : 
             session.selectedAction === 'Build' ? <House size={20} /> :
             <Leaf size={20} />}
            <span>{session.selectedAction}</span>
          </div>
        </Tooltip>
        <Tooltip content="Minutes for focus session">
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            <Clock size={20} />
            <span>{session.selectedTime}</span>
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