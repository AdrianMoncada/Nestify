import React, { useEffect, useState } from "react";
import { Square, Bird, Home, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "../../components/Tooltip/tooltip-component";
// import { RainDrop } from "./components/RainDrop";
export default function TimerScreen() {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [cloudsMoving, setCloudsMoving] = useState(true);
  const [showRain, setShowRain] = useState(false);
  const rainDrops = Array.from(
    {
      length: 40,
    },
    (_, i) => ({
      x: Math.random() * 400,
      delay: Math.random() * 2,
    }),
  );
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
  return (
    <div className="relative w-[400px] h-[550px] overflow-hidden bg-[#CFF1D8] rounded-xl mx-auto border-2 border-[#784E2F]">
      <AnimatePresence>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute bg-[#E7F5E4]"
            initial={{
              x: -150,
              y: (i % 6) * 90 + 20,
              opacity: 0.8,
            }}
            animate={{
              x: cloudsMoving ? 450 : null,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              delay: (i % 6) * 3,
            }}
            style={{
              width: "120px",
              height: "60px",
              borderRadius: "30px",
            }}
          />
        ))}
      </AnimatePresence>
      <AnimatePresence>
        {/* {showRain && (
          <>
            {rainDrops.map((drop, i) => (
              <RainDrop key={`rain-${i}`} x={drop.x} delay={drop.delay} />
            ))}
          </>
        )} */}
      </AnimatePresence>
      <div className="relative z-10 flex items-center justify-center gap-6 p-4 mx-4 mt-4 bg-white/80 rounded-2xl">
        <Tooltip content="Finds rare items">
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            <Bird size={20} />
            <span>Crow</span>
          </div>
        </Tooltip>
        <Tooltip content="Build a nest using resources">
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            <Home size={20} />
            <span>Build</span>
          </div>
        </Tooltip>
        <Tooltip content="Minutes for focus session">
          <div className="flex items-center gap-2 text-[#784E2F] cursor-help">
            <Clock size={20} />
            <span>25</span>
          </div>
        </Tooltip>
      </div>
      <div className="absolute inset-x-0 top-[100px] bottom-0 z-10">
        <div
          className="relative mx-auto"
          style={{
            width: "288px",
            height: "288px",
          }}
        >
          <div className="absolute inset-0 bg-white rounded-[50%] shadow-lg flex items-center justify-center">
            <button
              onClick={() => {
                setShowModal(true);
                setCloudsMoving(false);
                setShowRain(true);
              }}
              className="p-4 text-[#784E2F] transition-colors duration-200 hover:text-red-500"
            >
              <Square size={48} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="text-[5.5rem] font-bold text-[#784E2F]">
            {formattedTime}
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
}