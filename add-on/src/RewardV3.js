import React, { useEffect, useState } from "react";
import { X, Home, Leaf, Feather, Bird, Heart } from "lucide-react";
export function App() {
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
    <div className="w-[400px] h-[550px] rounded-[24px] relative overflow-hidden flex items-center justify-center border-2 border-[#784E2F]">
      <div className="absolute inset-0 bg-[#CFF1D8]">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>
      <div className="rounded-[24px] w-[360px] p-4 relative flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <span className="text-2xl font-medium text-[#784E2F]">Nestify</span>
          <button className="w-8 h-8 flex items-center justify-center bg-[#ED834D] hover:bg-[#f08d5a] text-white rounded-full transition-colors border-2 border-[#784E2F] shadow-[0_4px_0_#CA6F41] active:shadow-[0_2px_0_#CA6F41] active:translate-y-0.5">
            <X size={16} />
          </button>
        </div>
        <h2 className="text-2xl font-medium text-[#784E2F] mb-4">
          Session Finished!
        </h2>
        <div className="w-36 h-36 mb-8 bg-gray-200 rounded-[24px] border-2 border-[#784E2F]" />
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
              <div className="group relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-[#784E2F] shadow-[0_2px_0_#9ca3af] hover:bg-gray-300 transition-colors cursor-help">
                  <span className="text-[#784E2F]">{item.icon}</span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded text-sm text-[#784E2F] border border-[#784E2F] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                  {descriptions[item.type]}
                </div>
              </div>
              <div className="w-[72px] h-[32px] bg-white rounded-2xl flex items-center justify-center">
                <span className="font-medium text-lg text-[#784E2F]">
                  {item.value}
                </span>
              </div>
              <span
                className={`text-base ${item.change.includes("-") ? "text-red-500" : item.change === "+0" ? "text-gray-400" : "text-green-500"}`}
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>
        <button className="w-full bg-[#DED75A] hover:bg-[#e3dc6f] text-[#784E2F] rounded-3xl py-3 mb-4 text-lg font-medium transition-colors border-2 border-[#784E2F] shadow-[0_6px_0_#98A64F] active:shadow-[0_2px_0_#98A64F] active:translate-y-0.5">
          Start Another Session
        </button>
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
