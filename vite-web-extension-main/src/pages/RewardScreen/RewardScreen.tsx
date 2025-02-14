import React, { useEffect, useState } from "react";
import { X, Home, Leaf, Feather, Bird, Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import HatchRewardAnimation from "../../assets/animations/hatch-reward-animation";
import { Button } from "../../components/button/Button";
import { Tooltip } from "../../components/Tooltip/tooltip-component";
import { SessionOutcome, Ecosystem, mockDb } from "../../mockDatabase/mock-database";

interface LocationState {
  outcome: SessionOutcome;
  session: {
    action: string;
    completed: boolean;
  };
}

export default function RewardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { outcome, session } = location.state as LocationState;
  
  const [ecosystem, setEcosystem] = useState<Ecosystem | null>(null);
  const [counts, setCounts] = useState({
    leaf: 0,
    feather: 0,
    house: 0,
    bird: 0,
  });

  // Load initial ecosystem state
  useEffect(() => {
    const loadEcosystem = async () => {
      const eco = await mockDb.getEcosystem("user1");
      setEcosystem(eco);
    };
    loadEcosystem();
  }, []);

  // Calculate changes based on session outcome
  const calculateChanges = () => {
    if (!ecosystem || !outcome) return {};
    
    return {
      leaf: {
        value: ecosystem.resources + outcome.resources_gained - outcome.resources_spent,
        change: outcome.resources_gained - outcome.resources_spent,
      },
      feather: {
        value: ecosystem.feathers + outcome.feathers_gained - outcome.feathers_spent,
        change: outcome.feathers_gained - outcome.feathers_spent,
      },
      house: {
        value: ecosystem.nests + outcome.nests_created,
        change: outcome.nests_created > 0 ? `+${outcome.nests_created}` : "+0",
      },
      bird: {
        value: `${ecosystem.population + outcome.population_increase}/${ecosystem.max_population + outcome.max_population_increase}`,
        change: outcome.population_increase > 0 ? `+${outcome.population_increase}` : "+0",
      },
    };
  };

  const descriptions = {
    leaf: "resources for building nests",
    house: "nests created",
    feather: "feathers for hatching eggs",
    bird: "bird population and max bird population",
  };

  // Animate counts
  useEffect(() => {
    if (!ecosystem) return;

    const changes = calculateChanges();
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    const incrementCounts = (step: number) => {
      setCounts((prev) => ({
        leaf: Math.min(
          Math.ceil((changes.leaf?.value || 0) / steps * step),
          changes.leaf?.value || 0
        ),
        feather: Math.min(
          Math.ceil((changes.feather?.value || 0) / steps * step),
          changes.feather?.value || 0
        ),
        house: Math.min(
          Math.ceil((changes.house?.value || 0) / steps * step),
          changes.house?.value || 0
        ),
        bird: ecosystem.population + outcome.population_increase,
      }));
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      incrementCounts(currentStep);
      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [ecosystem, outcome]);

  const handleStartNewSession = () => {
    navigate('/');
  };

  const changes = calculateChanges();

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
              change: changes.leaf?.change,
              type: "leaf",
            },
            {
              icon: <Feather size={20} />,
              value: counts.feather,
              change: changes.feather?.change,
              type: "feather",
            },
            {
              icon: <Home size={20} />,
              value: counts.house,
              change: changes.house?.change,
              type: "house",
            },
            {
              icon: <Bird size={20} />,
              value: counts.bird,
              change: changes.bird?.change,
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
                className={`text-base ${
                  Number(item.change) < 0
                    ? "text-red-500"
                    : Number(item.change) === 0
                    ? "text-gray-500"
                    : "text-green-500"
                }`}
              >
                {typeof item.change === 'number' ? (item.change > 0 ? `+${item.change}` : item.change) : item.change}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-5/5">
            <Button variant="primary" onClick={handleStartNewSession}>
              Start Another Session
            </Button>
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