import React from "react";
import { X } from "lucide-react";
const MovingClouds = () => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[24px]">
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>
    </div>
  );
};
export function App() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-[400px] h-[550px] relative border-4 border-[#784E2F] rounded-[24px] overflow-hidden">
        <div className="absolute inset-0 bg-[#CFF1D8]">
          <MovingClouds />
        </div>
        <div className="relative z-10 w-full h-full p-6 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4">
            <h1 className="text-[#784E2F] text-xl font-medium">Nestify</h1>
            <div className="relative h-8">
              <div className="w-8 h-[14px] absolute -bottom-[2px] bg-[#E86360] rounded-full border-2 border-[#784E2F]"></div>
              <button className="w-8 h-8 bg-[#ED834D] rounded-full flex items-center justify-center border-2 border-[#784E2F] hover:brightness-110 active:translate-y-1 transition-all relative">
                <X size={16} className="text-white stroke-[3]" />
              </button>
            </div>
          </div>
          <div className="w-56 h-56 mb-4 rounded-[24px] border-2 border-[#784E2F] bg-white/50 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-[#784E2F]/10 border-2 border-[#784E2F]"></div>
          </div>
          <h2 className="text-lg font-medium text-[#784E2F] mb-1">
            Build and Grow with Nestify
          </h2>
          <p className="text-sm text-[#784E2F]/90 text-center mb-6 font-normal">
            Your productivity takes shape here. Save your progress and build
            your habitat with Nestify.
          </p>
          <div className="w-full mb-3">
            <div className="relative">
              <button className="w-full bg-[#FEC651] text-[#784E2F] rounded-3xl py-2.5 flex items-center justify-center gap-2 border-2 border-[#784E2F] hover:brightness-105 active:translate-y-3 transition-all relative z-10 mb-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Continue with Google
              </button>
              <div className="w-full h-12 absolute top-3 -z-10 bg-[#E6B449] rounded-3xl border-2 border-[#784E2F]"></div>
            </div>
          </div>
          <div className="w-full mb-6">
            <div className="relative">
              <button className="w-full bg-[#FEC651] text-[#784E2F] rounded-3xl py-2.5 flex items-center justify-center border-2 border-[#784E2F] hover:brightness-105 active:translate-y-3 transition-all relative z-10 mb-3">
                Continue with Email
              </button>
              <div className="w-full h-12 absolute top-3 -z-10 bg-[#E6B449] rounded-3xl border-2 border-[#784E2F]"></div>
            </div>
          </div>
          <div className="text-xs text-[#784E2F]">
            Already have an account?{" "}
            <a
              href="#"
              className="text-[#784E2F] font-medium hover:opacity-80 transition-opacity"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes floatCloud {
          from {
            transform: translateX(-120px);
          }
          to {
            transform: translateX(420px);
          }
        }
        .cloud {
          position: absolute;
          background: #e7f5e4;
          border-radius: 50px;
          width: 120px;
          height: 40px;
          opacity: 0.8;
        }
        .cloud::before,
        .cloud::after {
          content: "";
          position: absolute;
          background: #e7f5e4;
          border-radius: 50%;
        }
        .cloud::before {
          width: 50px;
          height: 50px;
          top: -20px;
          left: 15px;
        }
        .cloud::after {
          width: 60px;
          height: 60px;
          top: -25px;
          right: 15px;
        }
        .cloud-1 {
          top: 20%;
          animation: floatCloud 15s linear infinite;
        }
        .cloud-2 {
          top: 50%;
          animation: floatCloud 20s linear infinite;
          animation-delay: -10s;
        }
        .cloud-3 {
          top: 75%;
          animation: floatCloud 17s linear infinite;
          animation-delay: -5s;
        }
      `}</style>
    </div>
  );
}
