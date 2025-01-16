import React, { useEffect, useState } from "react";
import { Bird, Home, Clock, Square } from "lucide-react";
export function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const handlePauseClick = () => {
    setIsPaused(true);
    setShowConfirmation(true);
  };
  const handleModalClose = () => {
    setShowConfirmation(false);
    setIsPaused(false);
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div
        className="relative w-[400px] h-[550px] overflow-hidden flex flex-col border-2 rounded-2xl"
        style={{
          backgroundColor: showConfirmation
            ? "#8fa894"
            : isPaused
              ? "#8fa894"
              : "#CFF1D8",
          borderColor: "#784E2F",
        }}
      >
        {isPaused && (
          <div className="rain-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="rain-drop"
                style={
                  {
                    "--delay": `${Math.random() * 2}s`,
                    "--position": `${Math.random() * 100}%`,
                  } as React.CSSProperties
                }
              ></div>
            ))}
          </div>
        )}
        <div
          className="cloud-layer"
          style={
            {
              "--speed": "25s",
              top: "10%",
              animationPlayState: isPaused ? "paused" : "running",
            } as React.CSSProperties
          }
        >
          <div
            className="cloud"
            style={{
              backgroundColor: "#E7F5E4",
              transform: "scale(1.2)",
            }}
          ></div>
        </div>
        <div
          className="cloud-layer"
          style={
            {
              "--speed": "30s",
              top: "30%",
              animationPlayState: isPaused ? "paused" : "running",
            } as React.CSSProperties
          }
        >
          <div
            className="cloud"
            style={{
              backgroundColor: "#E7F5E4",
              transform: "scale(1.4)",
            }}
          ></div>
        </div>
        <div
          className="cloud-layer"
          style={
            {
              "--speed": "20s",
              top: "50%",
              animationPlayState: isPaused ? "paused" : "running",
            } as React.CSSProperties
          }
        >
          <div
            className="cloud"
            style={{
              backgroundColor: "#E7F5E4",
              transform: "scale(1.1)",
            }}
          ></div>
        </div>
        <div
          className="cloud-layer"
          style={
            {
              "--speed": "35s",
              top: "70%",
              animationPlayState: isPaused ? "paused" : "running",
            } as React.CSSProperties
          }
        >
          <div
            className="cloud"
            style={{
              backgroundColor: "#E7F5E4",
              transform: "scale(1.3)",
            }}
          ></div>
        </div>
        <div
          className="cloud-layer"
          style={
            {
              "--speed": "28s",
              top: "85%",
              animationPlayState: isPaused ? "paused" : "running",
            } as React.CSSProperties
          }
        >
          <div
            className="cloud"
            style={{
              backgroundColor: "#E7F5E4",
              transform: "scale(1.2)",
            }}
          ></div>
        </div>
        <div className="relative z-10 flex flex-col h-full p-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-16">
            <div
              className="flex items-center justify-center gap-6"
              style={{
                color: "#784E2F",
              }}
            >
              <div
                data-tooltip="Finds rare items"
                className="flex items-center gap-2 cursor-help relative group"
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Finds rare items
                </div>
                <Bird className="w-5 h-5" />
                <span>Crow</span>
              </div>
              <div
                data-tooltip="Build a nest using resources"
                className="flex items-center gap-2 cursor-help relative group"
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Build a nest using resources
                </div>
                <Home className="w-5 h-5" />
                <span>Build</span>
              </div>
              <div
                data-tooltip="After this time your ecosystem grows"
                className="flex items-center gap-2 cursor-help relative group"
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  After this time your ecosystem grows
                </div>
                <Clock className="w-5 h-5" />
                <span>25</span>
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Square
                onClick={handlePauseClick}
                className="w-12 h-12 text-gray-400 cursor-pointer transition-all duration-300 hover:text-[#ED834D] hover:shadow-lg [&>path]:fill-transparent"
              />
            </div>
          </div>
          <div className="absolute bottom-8 left-0 right-0 flex justify-center mt-16">
            <div
              className="text-[80px] font-medium"
              style={{
                color: "#784E2F",
              }}
            >
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>
          </div>
          {showConfirmation && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20"
              onClick={handleModalClose}
            >
              <div
                className="bg-white p-6 rounded-lg shadow-lg w-[80%] border-2"
                onClick={(e) => e.stopPropagation()}
                style={{
                  borderColor: "#784E2F",
                }}
              >
                <p
                  className="text-center text-lg mb-6"
                  style={{
                    color: "#784E2F",
                  }}
                >
                  Are you sure you want to cancel your focus session?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-6 py-2 border-2 rounded-[24px] transition-colors"
                    style={{
                      backgroundColor: "#ED834D",
                      borderColor: "#784E2F",
                      color: "#784E2F",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleModalClose}
                    className="px-6 py-2 border-2 rounded-[24px] transition-colors"
                    style={{
                      backgroundColor: "#DED75A",
                      borderColor: "#784E2F",
                      color: "#784E2F",
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <style jsx>{`
          .rain-container {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
          }
          .rain-drop {
            position: absolute;
            width: 2px;
            height: 100px;
            background: linear-gradient(transparent, rgba(255, 255, 255, 0.5));
            animation: rain 1s linear infinite;
            animation-delay: var(--delay);
            left: var(--position);
          }
          @keyframes rain {
            0% {
              transform: translateY(-100px);
            }
            100% {
              transform: translateY(550px);
            }
          }
          .cloud-layer {
            position: absolute;
            left: 0;
            width: 100%;
            animation: moveCloud linear infinite;
            animation-duration: var(--speed);
          }
          .cloud {
            position: relative;
            width: 180px;
            height: 60px;
            border-radius: 30px;
          }
          .cloud:before,
          .cloud:after {
            content: "";
            position: absolute;
            background: inherit;
            border-radius: 50%;
          }
          .cloud:before {
            width: 80px;
            height: 80px;
            top: -30px;
            left: 25px;
          }
          .cloud:after {
            width: 100px;
            height: 100px;
            top: -40px;
            left: 60px;
          }
          @keyframes moveCloud {
            from {
              transform: translateX(400px);
            }
            to {
              transform: translateX(-200px);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
