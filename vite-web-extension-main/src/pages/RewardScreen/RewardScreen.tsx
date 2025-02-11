import React, { useEffect, useState } from "react";
import { X, Home, Leaf, Feather, Bird, Heart } from "lucide-react";
import HatchRewardAnimation from "../../assets/animations/hatch-reward-animation";
import { Button } from "../../components/button/Button";
import { Tooltip} from "../../components/Tooltip/tooltip-component";

export default function RewardScreen() {
  const descriptions = {
    leaf: "resources for build nests",
    house: "nests created",
    feather: "feathers for hatch eggs",
    bird: "bird population and max bird population",
  };
  const [counts, setCounts] = useState({
    leaf: 0,
    feather: 0,
    house: 0,
    bird: 0,
  });
  const targetCounts = {
    leaf: 12,
    feather: 24,
    house: 8,
    bird: 16,
  };

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    const incrementCounts = (step) => {
      setCounts((prev) => ({
        leaf: Math.min(
          Math.ceil((targetCounts.leaf / steps) * step),
          targetCounts.leaf,
        ),
        feather: Math.min(
          Math.ceil((targetCounts.feather / steps) * step),
          targetCounts.feather,
        ),
        house: Math.min(
          Math.ceil((targetCounts.house / steps) * step),
          targetCounts.house,
        ),
        bird: Math.min(
          Math.ceil((targetCounts.bird / steps) * step),
          targetCounts.bird,
        ),
      }));
    };
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      incrementCounts(currentStep);
      if (currentStep >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-medium text-[#784E2F] mb-2 mt-4">
        Session Finished!
      </h2>
      
      {/* Animation Container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative" style={{ width: "250px", height: "250px" }}>
        <HatchRewardAnimation />
        </div>
      </div>
      <div className="p-4 flex flex-col items-center w-full">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full max-w-xs mb-6">
          {[
            {
              icon: <Leaf size={20} />,
              value: counts.leaf,
              target: "12",
              change: "-1",
              type: "leaf",
            },
            {
              icon: <Feather size={20} />,
              value: counts.feather,
              target: "24",
              change: "+0",
              type: "feather",
            },
            {
              icon: <Home size={20} />,
              value: counts.house,
              target: "8",
              change: "+1",
              type: "house",
            },
            {
              icon: <Bird size={20} />,
              value: `${counts.bird}/16`,
              target: "16/16",
              change: "+5",
              type: "bird",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
            <Tooltip content={descriptions[item.type]} position="top">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-[#784E2F] shadow-[0_2px_0_#9ca3af] hover:bg-gray-300 transition-colors cursor-help">
                <span className="text-[#784E2F]">{item.icon}</span>
              </div>
            </Tooltip>
            <div className="w-[72px] h-[32px] bg-white rounded-2xl flex items-center justify-center">
              <span className="font-medium text-lg text-[#784E2F]">
                {item.value}
              </span>
            </div>
            <span
              className={`text-base ${item.change.includes("-") ? "text-red" : item.change === "+0" ? "text-gray" : "text-green"}`}
            >
              {item.change}
            </span>
          </div>
        ))}
        </div>
        <div className="flex justify-center mb-4">
        <div className="w-5/5">
          <Button variant="primary">Start Another Session</Button>
        </div>
      </div>
        <div className="flex items-center gap-2 text-sm text-[#784E2F]">
          <span>Enjoying Nestify?</span>
          <a href="#" className="text-[#784E2F] hover:underline">
            Make a small donation
          </a>
          <Heart size={16} className="text-[#784E2F]" />
        </div>
      </div>
    </div>
  );
}