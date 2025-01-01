import React, { useEffect, useState } from "react";
import { Bird } from "lucide-react";
export function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const handleStop = () => {
    setIsActive(false);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <main className="w-[400px] h-[550px] bg-white rounded-lg shadow-lg flex flex-col items-center p-8">
        <div className="w-full flex items-center justify-between mb-12 text-gray-600">
          <div className="flex items-center gap-2">
            <Bird className="w-5 h-5" />
            <span className="text-sm">Crow</span>
          </div>
          <div className="text-sm">Gathering Resources</div>
          <div className="text-sm">25 minutes</div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div
            className={`text-7xl font-light tracking-wider ${isActive ? "animate-pulse" : ""}`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
        <button
          onClick={handleStop}
          className="px-8 py-3 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors mt-12"
        >
          Stop Session
        </button>
      </main>
    </div>
  );
}
