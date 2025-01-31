import React, { useState } from "react";
import { Button } from "../../components/button/Button";
import { CarouselButton } from "../../components/CarouselButton/CarouselButton";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { TimerDisplay } from "../../components/TimerDisplay/TimerDisplay";
import { TimerButton } from "../../components/TimerButton/TimerButton";
import Robin from "../../assets/img/Robin.png";
import Crow from "../../assets/img/Crow.png";
import Hornero from "../../assets/img/Hornero.png";
import Pelican from "../../assets/img/Pelican.png";

interface Ecosystem {
  nest: number;
  population: number;
  max_population: number;
  feathers: number;
  resources: number;
}

const MOCK_ECOSYSTEM: Ecosystem = {
  nest: 2,
  population: 8,
  max_population: 10,
  feathers: 0,
  resources: 0,
};

const BIRDS = [
  { name: "Sparrow", description: "Reliable all-rounder", image: Robin },
  { name: "Crow", description: "Find rare items", image: Crow },
  { name: "Hornero", description: "Builds larger nests", image: Hornero },
  { name: "Pelican", description: "Gather more resources", image: Pelican },
];

const TIMER_OPTIONS = [10, 15, 20, 25, 30];
const ACTIONS = ["home", "leaf", "egg"] as const;

export default function SelectionScreen() {
  const [currentBird, setCurrentBird] = useState(3);
  const [selectedAction, setSelectedAction] = useState<typeof ACTIONS[number]>("leaf");
  const [timer, setTimer] = useState(25);
  const [ecosystem] = useState<Ecosystem>(MOCK_ECOSYSTEM);

  const handleTimerAdjust = (amount: number) => {
    const newIndex = TIMER_OPTIONS.indexOf(timer) + Math.sign(amount);
    if (newIndex >= 0 && newIndex < TIMER_OPTIONS.length) {
      setTimer(TIMER_OPTIONS[newIndex]);
    }
  };

  const validateAction = (action: typeof ACTIONS[number]): boolean => {
    switch (action) {
      case "egg":
        return ecosystem.feathers >= 1 && ecosystem.population < ecosystem.max_population;
      case "home":
        return ecosystem.resources >= 1;
      case "leaf":
        return true; // Gather action doesn't need validation
      default:
        return false;
    }
  };

  const BirdCard = () => (
    <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-2 w-[280px]">
      <div className="flex items-center gap-4">
        <div className="w-[180px] h-[180px] rounded-xl overflow-hidden flex-shrink-0">
          <img 
            src={BIRDS[currentBird].image} 
            alt={BIRDS[currentBird].name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-brown">
            {BIRDS[currentBird].name}
          </h2>
          <p className="text-xs text-brown/80">
            {BIRDS[currentBird].description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-10">
      <h1 className="text-center text-xl font-medium mb-2 mt-3 text-brown">
        Select Your Bird
      </h1>

      <div className="flex items-center justify-center gap-2 mb-2">
        <CarouselButton 
          direction="prev" 
          onClick={() => setCurrentBird((prev) => (prev - 1 + BIRDS.length) % BIRDS.length)}
        />
        <BirdCard />
        <CarouselButton 
          direction="next" 
          onClick={() => setCurrentBird((prev) => (prev + 1) % BIRDS.length)}
        />
      </div>

      <div className="flex justify-center gap-3 mb-2">
        {BIRDS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBird(index)}
            className={`w-3 h-3 rounded-full ${
              currentBird === index ? "bg-yellow" : "bg-white"
            }`}
          />
        ))}
      </div>

      <h2 className="text-center text-xl font-medium mb-2 text-brown">
        Choose an Action
      </h2>
      <div className="flex justify-center gap-12 mb-4">
        {ACTIONS.map((action) => (
          <ActionButton
            key={action}
            action={action}
            selectedAction={selectedAction}
            onClick={() => setSelectedAction(action)}
            isValid={validateAction(action)}
          />
        ))}
      </div>

      <h2 className="text-center text-xl font-medium mb-2 text-brown">
        Set a Timer
      </h2>
      <div className="flex items-center justify-center gap-3 mb-3">
        <TimerButton type="minus" onClick={() => handleTimerAdjust(-5)} />
        <TimerDisplay timer={timer} />
        <TimerButton type="plus" onClick={() => handleTimerAdjust(5)} />
      </div>

      <div className="flex justify-center">
        <div className="w-4/5">
          <Button variant="primary" >Start Focus Session</Button>
        </div>
      </div>
    </div>
  );
}