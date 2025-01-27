import React, { useState } from "react";
import {Button} from "../../components/button/Button";
import { CarouselButton } from "../../components/CarouselButton/CarouselButton";
import { ActionButton} from "../../components/ActionButton/ActionButton";
import { TimerDisplay} from "../../components/TimerDisplay/TimerDisplay";
import { TimerButton } from "../../components/TimerButton/TimerButton";
import Robin from "../../assets/img/Robin.png";
import Crow from "../../assets/img/Crow.png";
import Hornero from "../../assets/img/Hornero.png";

const birds = [
  {
    name: "Sparrow",
    description: "Reliable all-rounder",
    image: Robin
  },
  {
    name: "Crow",
    description: "Find rare items",
    image: Crow
  },
  // {
  //   name: "Pelican",
  //   description: "Carries heavy loads",
  //   image: Robin
  // },
  {
    name: "Hornero",
    description: "Builds larger nests",
    image: Hornero
  },
];
const TIMER_OPTIONS = [10, 15, 20, 25, 30];

export default function SelectionScreen() {
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
  return (
      <div className="relative z-10">
        <h1 className="text-center text-xl font-medium mb-3 text-brown">
          Select Your Bird
        </h1>
        <div className="flex items-center justify-center gap-4 mb-3">
        <CarouselButton direction="prev" onClick={prevBird}/>
          
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 w-[280px]">
  <div className="flex items-center gap-4">
    {/* Bird image */}
    <div className="w-[140px] h-[140px] rounded-xl overflow-hidden flex-shrink-0">
      <img 
        src={birds[currentBird].image} 
        alt={birds[currentBird].name} 
        className="w-full h-full object-cover"
      />
    </div>
    
    {/* Text content */}
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-medium text-brown">
        {birds[currentBird].name}
      </h2>
      <p className="text-xs text-brown/80">
        {birds[currentBird].description}
      </p>
    </div>
  </div>
</div>
          <CarouselButton direction="next" onClick={nextBird} />
        </div>
        <div className="flex justify-center gap-2 mb-3">
          {birds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBird(index)}
              className={`w-3 h-3 rounded-full ${currentBird === index ? "bg-yellow" : "bg-white"}`}
            />
          ))}
        </div>
        <h2 className="text-center text-xl font-medium mb-2 text-brown">
          Choose an Action
        </h2>
        <div className="flex justify-center gap-10 mb-3">
          {["leaf", "home", "egg"].map((action) => (
            <ActionButton 
            key={action}
            action={action as 'leaf' | 'home' | 'egg'}
            selectedAction={selectedAction}
          onClick={() => setSelectedAction(action)}
          />
          ))}
        </div>
        <h2 className="text-center text-xl font-medium mb-2 text-brown">Set a Timer</h2>
        <div className="flex items-center justify-center gap-5 mb-4">
          <TimerButton 
            type="minus" 
            onClick={() => adjustTimer(-5)} 
          />
          <TimerDisplay timer={timer} />
          <TimerButton 
            type="plus" 
            onClick={() => adjustTimer(5)} 
          />
        </div>
        <Button variant="standardPositive">
            Start Focus Session
          </Button>
        
      </div>
    
  );
}