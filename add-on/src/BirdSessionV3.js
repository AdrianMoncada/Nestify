import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Egg,
  Leaf,
  Plus,
  Minus,
} from "lucide-react";
const birds = [
  {
    name: "Sparrow",
    description: "Reliable all-rounder",
  },
  {
    name: "Crow",
    description: "Find rare items",
  },
  {
    name: "Pelican",
    description: "Carries heavy loads",
  },
  {
    name: "Hornero",
    description: "Builds larger nests",
  },
];
const TIMER_OPTIONS = [10, 15, 20, 25, 30];
export function App() {
  const [currentBird, setCurrentBird] = useState(0);
  const [selectedAction, setSelectedAction] = useState("home");
  const [timer, setTimer] = useState(25);
  const nextBird = () => {
    setCurrentBird((prev) => (prev + 1) % birds.length);
  };
  const prevBird = () => {
    setCurrentBird((prev) => (prev - 1 + birds.length) % birds.length);
  };
  const adjustTimer = (amount = number) => {
    const currentIndex = TIMER_OPTIONS.indexOf(timer);
    if (amount > 0 && currentIndex < TIMER_OPTIONS.length - 1) {
      setTimer(TIMER_OPTIONS[currentIndex + 1]);
    } else if (amount < 0 && currentIndex > 0) {
      setTimer(TIMER_OPTIONS[currentIndex - 1]);
    }
  };
  const baseButtonStyle =
    "border-2 border-[#784E2F] transition-all active:shadow-[0_0_0_#784E2F] active:translate-y-[6px]";
  const buttonStyle = `${baseButtonStyle} hover:bg-[#fed77f]`;
  const yellowButtonStyle = `${buttonStyle} bg-[#FEC651] shadow-[0_6px_0_#784E2F]`;
  const greenButtonStyle = `${buttonStyle} bg-[#ded75a] shadow-[0_6px_0_#98a64f]`;
  const actionButtonStyle = `${baseButtonStyle} bg-[#FEC651] shadow-[0_6px_0_#784E2F]`;
  return (
    <div
      className="w-[400px] h-[550px] bg-[#CFF1D8] p-5 flex flex-col border-2 border-[#784E2F] relative overflow-hidden rounded-[24px]"
      style={{
        fontFamily: "Inter, sans-serif",
        color: "#784E2F",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[
          {
            w: 300,
            h: 150,
            top: "5%",
            left: "-30%",
            duration: "180s",
            delay: "0s",
          },
          {
            w: 400,
            h: 200,
            top: "40%",
            left: "10%",
            duration: "240s",
            delay: "60s",
          },
          {
            w: 350,
            h: 175,
            top: "70%",
            left: "-20%",
            duration: "210s",
            delay: "120s",
          },
        ].map((cloud, i) => (
          <div
            key={i}
            className="absolute bg-[#E7F5E4]"
            style={{
              width: `${cloud.w}px`,
              height: `${cloud.h}px`,
              borderRadius: "100px",
              top: cloud.top,
              left: cloud.left,
              animation: `moveCloud ${cloud.duration} linear infinite`,
              animationDelay: cloud.delay,
              boxShadow: `0 ${cloud.h / 2}px 0 #E7F5E4, -${cloud.w / 8}px ${cloud.h * 0.875}px 0 #E7F5E4, ${cloud.w / 8}px ${cloud.h * 0.875}px 0 #E7F5E4`,
            }}
          />
        ))}
        <style>{`
          @keyframes moveCloud {
            from { transform: translateX(-100%); }
            to { transform: translateX(400%); }
          }
        `}</style>
      </div>
      <div className="relative z-10">
        <h1 className="text-center text-xl font-medium mb-3">
          Select Your Bird
        </h1>
        <div className="flex items-center justify-center gap-4 mb-3">
          <button
            onClick={prevBird}
            className={`${yellowButtonStyle} w-8 h-8 rounded-full flex items-center justify-center active:translate-y-[2px]`}
          >
            <ChevronLeft className="w-4 h-4 text-[#784E2F]" />
          </button>
          <div className="bg-[#FFFFFF] rounded-3xl p-3 w-[240px]">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mb-2" />
              <h2 className="text-lg font-medium mb-0.5">
                {birds[currentBird].name}
              </h2>
              <p className="text-sm text-center">
                {birds[currentBird].description}
              </p>
            </div>
          </div>
          <button
            onClick={nextBird}
            className={`${yellowButtonStyle} w-8 h-8 rounded-full flex items-center justify-center active:translate-y-[2px]`}
          >
            <ChevronRight className="w-4 h-4 text-[#784E2F]" />
          </button>
        </div>
        <div className="flex justify-center gap-2 mb-3">
          {birds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBird(index)}
              className={`w-3 h-3 rounded-full ${currentBird === index ? "bg-[#FEC651]" : "bg-[#FFFFFF]"}`}
            />
          ))}
        </div>
        <h2 className="text-center text-xl font-medium mb-2">
          Choose an Action
        </h2>
        <div className="flex justify-center gap-4 mb-3">
          {["leaf", "home", "egg"].map((action) => (
            <button
              key={action}
              onClick={() => setSelectedAction(action)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${actionButtonStyle} 
                ${selectedAction === action ? "bg-[#FEC651]" : "bg-[#FFFFFF]"}`}
            >
              {action === "leaf" && <Leaf className="w-6 h-6 text-[#784E2F]" />}
              {action === "home" && <Home className="w-6 h-6 text-[#784E2F]" />}
              {action === "egg" && <Egg className="w-6 h-6 text-[#784E2F]" />}
            </button>
          ))}
        </div>
        <h2 className="text-center text-xl font-medium mb-2">Set a Timer</h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => adjustTimer(-5)}
            className={`${yellowButtonStyle} w-12 h-12 rounded-2xl flex items-center justify-center`}
          >
            <Minus className="w-6 h-6 text-[#784E2F]" />
          </button>
          <div className="w-16 h-16 bg-[#FFFFFF] rounded-2xl flex items-center justify-center text-2xl font-medium">
            {timer}
          </div>
          <button
            onClick={() => adjustTimer(5)}
            className={`${yellowButtonStyle} w-12 h-12 rounded-2xl flex items-center justify-center`}
          >
            <Plus className="w-6 h-6 text-[#784E2F]" />
          </button>
        </div>
        <button
          className={`${greenButtonStyle} w-full py-3.5 rounded-2xl font-medium`}
        >
          Start Focus Session
        </button>
      </div>
    </div>
  );
}