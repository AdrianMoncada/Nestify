import React from 'react';
import Bird from "../img/Gather.png"
export const JumpingBird = () => {
  return <div className="animate-varied-jump relative">
      <img src={Bird} alt="Cartoon Bird" className="w-60 h-60 object-contain relative z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[...Array(12)].map((_, i) => <div key={i} className={`particle particle-${i + 1}`}></div>)}
      </div>
      <style>
        {`
          @keyframes varied-jump {
            0%, 100% { transform: translateY(0); }
            20% { transform: translateY(-20px); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-30px); }
            80% { transform: translateY(-15px); }
          }
          .animate-varied-jump {
            animation: varied-jump 4s ease-in-out infinite;
          }
          .particle {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.8;
          }
          .particle-1, .particle-7 { background: #483626; }  /* darkBrown */
          .particle-2, .particle-8 { background: #75634F; }  /* brown */
          .particle-3, .particle-9 { background: #957F66; }  /* lightBrown */
          .particle-4, .particle-10 { background: #FDD176; } /* yellow */
          .particle-5, .particle-11 { background: #FFDA8C; } /* yellowLight */
          .particle-6, .particle-12 { background: #DAB466; } /* yellowDark */
          .particle-1 { animation: gentle-float 2.5s infinite; }
          .particle-2 { animation: gentle-float 2.8s infinite 0.3s; }
          .particle-3 { animation: gentle-float 2.6s infinite 0.6s; }
          .particle-4 { animation: gentle-float 2.7s infinite 0.9s; }
          .particle-5 { animation: gentle-float-reverse 2.9s infinite 0.4s; }
          .particle-6 { animation: gentle-float-reverse 2.5s infinite 0.7s; }
          .particle-7 { animation: gentle-float 2.7s infinite 1s; }
          .particle-8 { animation: gentle-float-reverse 2.6s infinite 0.5s; }
          .particle-9 { animation: gentle-float 2.4s infinite 0.2s; }
          .particle-10 { animation: gentle-float-reverse 2.3s infinite 0.8s; }
          .particle-11 { animation: gentle-float 2.8s infinite 0.1s; }
          .particle-12 { animation: gentle-float-reverse 2.5s infinite 0.4s; }
          @keyframes gentle-float {
            0% { 
              transform: translate(0, 0);
              opacity: 0.8;
            }
            100% { 
              transform: translate(20px, -40px);
              opacity: 0;
            }
          }
          @keyframes gentle-float-reverse {
            0% { 
              transform: translate(0, 0);
              opacity: 0.8;
            }
            100% { 
              transform: translate(-20px, -40px);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>;
};