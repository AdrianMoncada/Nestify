import React from 'react';
// import { Egg } from "lucide-react";
import Egg from "../img/Egg.png";

export const EggAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[
          // Primera capa de partículas
          { color: "#FDD176", left: "20%", top: "30%", delay: 0 },
          { color: "#75634F", left: "70%", top: "40%", delay: 1.5 },
          { color: "#FDD176", left: "40%", top: "60%", delay: 3 },
          { color: "#75634F", left: "60%", top: "70%", delay: 4.5 },
          { color: "#FDD176", left: "30%", top: "50%", delay: 6 },
          // Segunda capa de partículas
          { color: "#FDD176", left: "25%", top: "35%", delay: 2 },
          { color: "#75634F", left: "65%", top: "45%", delay: 3.5 },
          { color: "#FDD176", left: "45%", top: "55%", delay: 5 },
          { color: "#75634F", left: "55%", top: "65%", delay: 1 },
          { color: "#FDD176", left: "35%", top: "75%", delay: 2.5 },
          // Tercera capa de partículas
          { color: "#FDD176", left: "15%", top: "25%", delay: 4 },
          { color: "#75634F", left: "75%", top: "35%", delay: 5.5 },
          { color: "#FDD176", left: "50%", top: "45%", delay: 0.5 },
          { color: "#75634F", left: "45%", top: "80%", delay: 2.8 },
          { color: "#FDD176", left: "80%", top: "60%", delay: 3.2 }
        ].map((particle, i) => (
          <div
            key={i}
            className="particle"
            style={{
              backgroundColor: particle.color,
              left: particle.left,
              top: particle.top,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Egg and shadow - Centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div 
            className="absolute w-16 h-2 rounded-full bg-[#483626] animate-shadow"
            style={{
              filter: "blur(4px)",
              opacity: 0.2,
              bottom: "-12px",
              left: "50%",
              transform: "translateX(-50%)"
            }}
          />
          <img
            src={Egg}
            alt="egg"
            className="w-50 h-50 animate-egg-shake"
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes egg-shake {
          0%, 100% { transform: rotate(-5deg) translateY(0); }
          20% { transform: rotate(0deg) translateY(-6px); }
          40% { transform: rotate(5deg) translateY(0); }
          60% { transform: rotate(0deg) translateY(-6px); }
          85% { transform: rotate(-2deg) translateY(0); }
          87% { transform: rotate(2deg) translateY(-1px); }
          89% { transform: rotate(-1.5deg) translateY(-0.5px); }
          91% { transform: rotate(1.5deg) translateY(-1px); }
          93% { transform: rotate(-1deg) translateY(-0.5px); }
          95% { transform: rotate(1deg) translateY(0); }
          97% { transform: rotate(-0.5deg) translateY(0); }
        }

        @keyframes shadow {
          0%, 100% { transform: translateX(-50%) scaleX(1.1); opacity: 0.15; }
          20% { transform: translateX(-50%) scaleX(0.9); opacity: 0.2; }
          40% { transform: translateX(-50%) scaleX(1.1); opacity: 0.15; }
          60% { transform: translateX(-50%) scaleX(0.9); opacity: 0.2; }
          85% { transform: translateX(-50%) scaleX(1.05); opacity: 0.15; }
          87% { transform: translateX(-50%) scaleX(0.95); opacity: 0.18; }
          89% { transform: translateX(-50%) scaleX(1.02); opacity: 0.17; }
          91% { transform: translateX(-50%) scaleX(0.98); opacity: 0.18; }
          93% { transform: translateX(-50%) scaleX(1.01); opacity: 0.16; }
          95% { transform: translateX(-50%) scaleX(0.99); opacity: 0.17; }
          97% { transform: translateX(-50%) scaleX(1); opacity: 0.15; }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          15%, 85% { opacity: 0.6; }
          50% { transform: translate(var(--moveX, 15px), var(--moveY, -15px)); opacity: 0.8; }
        }

        .animate-egg-shake {
          animation: egg-shake 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          transform-origin: bottom center;
        }

        .animate-shadow {
          animation: shadow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          opacity: 0;
          animation: float 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};