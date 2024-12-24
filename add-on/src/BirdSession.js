import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Egg, Home, Leaf } from "lucide-react";
import { createRoot } from "react-dom/client";

export default function BirdSession() {    


  const [selectedBird, setSelectedBird] = useState("crow");
  const [selectedAction, setSelectedAction] = useState("");
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [currentBirdIndex, setCurrentBirdIndex] = useState(1);
  const birds = [
    {
      id: "crow",
      name: "Crow",
      description: "Excels at gathering hidden treasures",
    },
    {
      id: "hornero",
      name: "Hornero",
      description: "Builds nests that house more companions",
    },
    {
      id: "pelican",
      name: "Pelican",
      description: "Carries more with each trip",
    },
    {
      id: "sparrow",
      name: "Sparrow",
      description: "Thrives in any task",
    },
  ];
  const actions = [
    {
      id: "gather",
      icon: Leaf,
      tooltip: "Gather resources for your nest",
    },
    {
      id: "build",
      icon: Home,
      tooltip: "Construct your perfect nest",
    },
    {
      id: "hatch",
      icon: Egg,
      tooltip: "Care for your eggs",
    },
  ];
  const decrementTimer = () => {
    if (timerMinutes > 10) {
      setTimerMinutes((prev) => prev - 5);
    }
  };
  const incrementTimer = () => {
    if (timerMinutes < 25) {
      setTimerMinutes((prev) => prev + 5);
    }
  };
  const nextBird = () => {
    if (currentBirdIndex < birds.length - 1) {
      setCurrentBirdIndex((prev) => prev + 1);
      setSelectedBird(birds[currentBirdIndex + 1].id);
    }
  };
  const previousBird = () => {
    if (currentBirdIndex > 0) {
      setCurrentBirdIndex((prev) => prev - 1);
      setSelectedBird(birds[currentBirdIndex - 1].id);
    }
  };
  return (
    <main className="w-[400px] h-[550px] bg-white p-4 flex flex-col gap-5 overflow-hidden">
      {/* Bird Selection Carousel */}
      <section className="relative">
        <h2 className="text-lg font-semibold mb-3 text-center">
        Select Your Bird
        </h2>
        <div className="relative flex items-center">
          <button
            onClick={previousBird}
            className="absolute -left-2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
            aria-label="Previous bird"
            disabled={currentBirdIndex === 0}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="overflow-hidden mx-8">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentBirdIndex * 100}%)`,
              }}
            >
              {birds.map((bird) => (
                <div
                  key={bird.id}
                  className={`relative flex-none w-full p-3 rounded-xl border-2 transition-all duration-300 ${selectedBird === bird.id ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="w-14 h-14 rounded-full bg-gray-200 mx-auto mb-2 transition-transform duration-300 transform hover:scale-105" />
                  <h3 className="font-semibold text-base text-center mb-1">
                    {bird.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {bird.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextBird}
            className="absolute -right-2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
            aria-label="Next bird"
            disabled={currentBirdIndex === birds.length - 1}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-3">
          {birds.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentBirdIndex === index ? "bg-blue-500 scale-125" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </section>

      {/* Action Selection */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-center">
          Choose an Action
        </h2>
        <div className="flex justify-center gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setSelectedAction(action.id)}
                className={`group relative p-3 rounded-xl border-2 transition-all duration-300 ${selectedAction === action.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
              >
                <Icon
                  className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${selectedAction === action.id ? "text-blue-500" : "text-gray-600"}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {action.tooltip}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Timer Selection */}
      <section className="text-center">
        <h2 className="text-lg font-semibold mb-3">Set a Timer</h2>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={decrementTimer}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-transparent"
            disabled={timerMinutes <= 10}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="bg-blue-50 rounded-2xl px-6 py-2 transition-all duration-300 ease-in-out transform hover:bg-blue-100">
            <span className="text-3xl font-bold text-blue-600 transition-all duration-300 ease-in-out">
              {timerMinutes}
            </span>
          </div>

          <button
            onClick={incrementTimer}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-transparent"
            disabled={timerMinutes >= 25}
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </section>

      {/* Start Button */}
      <button
        className="mt-auto w-full py-3 px-6 rounded-xl bg-blue-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl active:shadow-md transition-all duration-300 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 disabled:hover:scale-100 disabled:hover:shadow-lg"
        disabled={!selectedBird || !selectedAction || !timerMinutes}
      >
        Start Focus Session
      </button>
    </main>
  );
}
const root = document.getElementById("root");
createRoot(root).render(<BirdSession />);

