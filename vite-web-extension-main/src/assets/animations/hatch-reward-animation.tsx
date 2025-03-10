import React from 'react';
import HatchRewardImage from '../../assets/img/Hatch.png';
import GatherRewardImage from '../../assets/img/Gather.png';
import BuildRewardImage from '../../assets/img/Build.png';
import DefaultRewardImage from '../../assets/img/Robin.png'

interface RewardAnimationProps {
  actionType?: string;
}

const HatchRewardAnimation: React.FC<RewardAnimationProps> = ({ actionType }) => {
  console.log(actionType);
  // Determinar qué imagen mostrar según la acción
  const getRewardImage = () => {
    if (!actionType) return DefaultRewardImage; // O cualquier imagen por defecto que desees
    switch (actionType.toLowerCase()) {
      case 'gather':
        return GatherRewardImage;
      case 'build':
        return BuildRewardImage;
      case 'hatch':
        return HatchRewardImage;
      default:
        return DefaultRewardImage; // Si actionType no coincide con ninguna opción
    }
  };


  return (
    <div className="relative w-full h-full flex items-center justify-center">
      
        {/* Reward Image based on action */}
        <img
          src={getRewardImage()}
          alt={`${actionType} Reward`}
          className="w-48 h-48 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-egg-sequence object-contain"
        />
        
        {/* Sparkles with original classes */}
        <div className="sparkle sparkle-1"></div>
        <div className="sparkle sparkle-2"></div>
        <div className="sparkle sparkle-3"></div>
        <div className="sparkle sparkle-4"></div>
        <div className="sparkle sparkle-5"></div>
      

      <style jsx>{`
        @keyframes egg-fall {
          0% {
            opacity: 0;
            transform: translate(-50%, -200%) rotate(0deg);
          }
          45% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(5deg);
          }
          75% {
            transform: translate(-50%, -50%) scale(0.85) rotate(0deg);
          }
          82% {
            transform: translate(-50%, -80%) scale(1.1) rotate(-3deg);
          }
          89% {
            transform: translate(-50%, -50%) scale(0.95) rotate(2deg);
          }
          93% {
            transform: translate(-50%, -60%) scale(1.02) rotate(-1deg);
          }
          96% {
            transform: translate(-50%, -50%) scale(0.98) rotate(1deg);
          }
          98% {
            transform: translate(-50%, -53%) scale(1) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes sparkle-float {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          30% {
            opacity: 1;
            transform: translate(var(--tx-1), -20px) scale(1);
            box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.5);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx-2), -80px) scale(0.1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }

        @keyframes egg-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        @keyframes egg-hover {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-4px);
          }
        }

        .animate-egg-sequence {
          animation: 
            egg-fall 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
            egg-pulse 1s ease-in-out 1.5s 2,
            egg-hover 2s ease-in-out 3.5s infinite;
        }

        .sparkle {
          position: absolute;
          width: 12px;
          height: 12px;
          left: 50%;
          top: 50%;
          pointer-events: none;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.6);
        }

        .sparkle::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0.5);
        }

        .sparkle-1 {
          --tx-1: -20px;
          --tx-2: -30px;
          animation: sparkle-float 1.2s ease-out 1.2s forwards;
        }

        .sparkle-2 {
          --tx-1: 15px;
          --tx-2: 25px;
          width: 4px;
          height: 4px;
          animation: sparkle-float 1.4s ease-out 1.3s forwards;
        }

        .sparkle-3 {
          --tx-1: -12px;
          --tx-2: -18px;
          width: 8px;
          height: 8px;
          animation: sparkle-float 1.3s ease-out 1.4s forwards;
        }

        .sparkle-4 {
          --tx-1: 18px;
          --tx-2: 22px;
          width: 5px;
          height: 5px;
          animation: sparkle-float 1.5s ease-out 1.25s forwards;
        }

        .sparkle-5 {
          --tx-1: -8px;
          --tx-2: -12px;
          width: 7px;
          height: 7px;
          animation: sparkle-float 1.6s ease-out 1.35s forwards;
        }
      `}</style>
    </div>
  );
};

export default HatchRewardAnimation;