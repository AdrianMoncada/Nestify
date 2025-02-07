import React, { useEffect, useState } from "react";
import { Bird, Clock, Egg, Eye, Backpack, Leaf, House, LeafyGreen } from "lucide-react";
import { Tooltip } from "../../components/Tooltip/tooltip-component";
import { useCloudAnimation } from '../../context/CloudAnimationContext';
import { StopButton } from '../../components/StopButton/StopButton';
import { Button } from '../../components/button/Button';
import {SessionState} from '../../types/session-types';
import { EggAnimation } from '../../assets/animations/EggAnimation';
import { BuildAnimation } from '../../assets/animations/BuildAnimation';
import { AnimatedBird } from '../../assets/animations/animated-bird'; 
import { useNavigate, useLocation} from "react-router-dom";

const TimerScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const session: SessionState = state

  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(session.selectedTime * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [showRain, setShowRain] = useState(false);
  const { setCloudsMoving } = useCloudAnimation();

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

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

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
                onClick={() => {
                  setIsRunning(false);
                  setShowModal(false);
                  setShowRain(false);
                  setCloudsMoving(true);
                  navigate('/');
                }}
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