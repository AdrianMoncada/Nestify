import React, { useEffect, useState } from "react";
import { X, Home, Leaf, Feather, Bird, Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import HatchRewardAnimation from "../../assets/animations/hatch-reward-animation";
import { Button } from "../../components/button/Button";
import { Tooltip } from "../../components/Tooltip/tooltip-component";
import { backendService } from "../../services/backend-service";
import RewardMessage from "./RewardMessage";

interface Ecosystem {
  id: string; // uuid
  user_id: string; // uuid
  nests: number;
  population: number;
  max_population: number;
  feathers: number;
  resources: number;
}
interface LocationState {
  outcome: any;
  session: {
    action: string;
    completed: boolean;
  };
  updatedEcosystem?: Ecosystem;
}

interface CountState {
  leaf: number;
  feather: number;
  house: number;
  bird: number;
  maxBird: number;
}

export default function RewardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rewardData, setRewardData] = useState<LocationState | null>(null);
  const [ecosystem, setEcosystem] = useState<Ecosystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<CountState>({
    leaf: 0,
    feather: 0,
    house: 0,
    bird: 0,
    maxBird: 0
  });

  useEffect(() => {
    const loadRewardData = async () => {
      try {
        

        // First, check navigation state
        if (location.state?.outcome && location.state?.session) {
          console.log("Using reward data from navigation state:", location.state);
          setRewardData(location.state);
          
          // Use passed ecosystem or fetch from service
          if (location.state.updatedEcosystem) {
            console.log("Using passed ecosystem:", location.state.updatedEcosystem);
            setEcosystem(location.state.updatedEcosystem);
          } else {
            console.log("Fetching ecosystem from service");
            const currentEcosystem = await backendService.getEcosystem();
            console.log("Fetched ecosystem:", currentEcosystem);
            setEcosystem(currentEcosystem);
          }
          
          setIsLoading(false);
          return;
        }

        console.log("No reward data in navigation state, checking storage");

        // Fallback to stored reward state
        const storage = await chrome.storage.local.get(['rewardState', 'ecosystem']);
        console.log("Storage data:", storage);
        
        if (storage.rewardState?.outcome && storage.rewardState?.session) {
          console.log("Using reward data from storage:", storage.rewardState);
          setRewardData({
            outcome: storage.rewardState.outcome,
            session: storage.rewardState.session
          });
          
          // Use stored ecosystem or fetch fresh
          if (storage.ecosystem) {
            console.log("Using stored ecosystem:", storage.ecosystem);
            setEcosystem(storage.ecosystem);
          } else {
            console.log("Fetching fresh ecosystem from service");
            const currentEcosystem = await backendService.getEcosystem();
            console.log("Fetched ecosystem:", currentEcosystem);
            setEcosystem(currentEcosystem);
          }
        } else {
          throw new Error('No reward data available');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading reward data:', error);
        setError('Failed to load reward data');
        setIsLoading(false);
      }
    };
    
    loadRewardData();
  }, [location.state, navigate]);


  // Load initial ecosystem state
  // useEffect(() => {
  //   const loadEcosystem = async () => {
  //     try {
  //       const eco = await mockDb.getEcosystem("user1");
  //       setEcosystem(eco);
  //     } catch (error) {
  //       console.error('Error loading ecosystem:', error);
  //       setError("Failed to load ecosystem data");
  //     }
  //   };
  //   loadEcosystem();
  // }, []);

  // Calculate changes based on session outcome
  const calculateChanges = () => {
    if (!ecosystem || !rewardData?.outcome) return {};
    
    const outcome = rewardData.outcome;
    return {
      leaf: {
        value: ecosystem.resources,
        change: outcome.resources_gained - outcome.resources_spent,
      },
      feather: {
        value: ecosystem.feathers,
        change: outcome.feathers_gained - outcome.feathers_spent,
      },
      house: {
        value: ecosystem.nests,
        change: outcome.nests_created > 0 ? `+${outcome.nests_created}` : "+0",
      },
      bird: {
        value: `${ecosystem.population + outcome.population_increase}/${ecosystem.max_population + outcome.max_population_increase}`,
        change: outcome.population_increase > 0 
          ? `+${outcome.population_increase}` 
          : outcome.max_population_increase > 0 
            ? `+${outcome.max_population_increase}` 
            : "+0",
      },
    };
  };

  const descriptions = {
    leaf: "Available resources",
    house: "Total nests built",
    feather: "Available feathers",
    bird: "Population and max population",
  } as const;

  // Animate counts
  useEffect(() => {
    if (!ecosystem || !rewardData) return;

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
        bird: Math.min(
          Math.ceil((ecosystem.population + rewardData.outcome.population_increase) / steps * step),
          ecosystem.population
        ),
        maxBird: Math.min(
          Math.ceil(ecosystem.max_population / steps * step), // Usa el valor correcto de max_population
          ecosystem.max_population
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
  }, [ecosystem, rewardData]);

  const handleStartNewSession = async () => {
    try {
      // Mark rewards as viewed and clear reward state
      await chrome.storage.local.remove(['rewardState']);
      navigate('/');
    } catch (error) {
      console.error('Error clearing reward state:', error);
      setError("Failed to start new session");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-[#784E2F] text-xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    );
  }

  if (!rewardData || !ecosystem) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-4">
        <div className="text-gray-500 text-xl mb-4">Loading ecosystem data...</div>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    );
  }

  const changes = calculateChanges();

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-medium text-[#784E2F] mb-2 mt-4">
        Session Finished!
      </h2>
      
      {/* Animation Container */}
      <div className="flex-1 flex flex-col items-center justify-center">
      <div className="relative" style={{ width: "200px", height: "200px" }}>
      <HatchRewardAnimation actionType={rewardData.session.action || "gather"} />
</div>
      </div>
      <RewardMessage 
      outcome={rewardData.outcome} 
      session={rewardData.session} 
      />
      <div className="p-4 flex flex-col items-center w-full">
        <div className="grid grid-cols-2 gap-x-1 gap-y-3 w-full max-w-xs mb-6">
          {[
            {
              icon: <Leaf size={20} />,
              value: counts.leaf,
              change: changes.leaf?.change,
              type: "leaf" as keyof typeof descriptions,
            },
            {
              icon: <Feather size={20} />,
              value: counts.feather,
              change: changes.feather?.change,
              type: "feather" as keyof typeof descriptions,
            },
            {
              icon: <Home size={20} />,
              value: counts.house,
              change: changes.house?.change,
              type: "house" as keyof typeof descriptions,
            },
            {
              icon: <Bird size={20} />,
              value: `${counts.bird}/${counts.maxBird}`,
              change: changes.bird?.change,
              type: "bird" as keyof typeof descriptions,
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Tooltip content={descriptions[item.type]} position="right">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center border-2 border-[#784E2F] shadow-[0_2px_0_#9ca3af] hover:bg-gray-200 transition-colors cursor-help">
                  <span className="text-[#784E2F]">{item.icon}</span>
                </div>
              </Tooltip>
              <div className="w-[72px] h-[32px] bg-white rounded-2xl flex items-center justify-center">
                <span className="font-medium text-lg text-[#784E2F]">
                  {item.value}
                </span>
              </div>
              <span
                className={`text-lg ${
                  Number(item.change) < 0
                    ? "text-red"
                    : Number(item.change) === 0
                    ? "text-transparent"
                    : "text-darkGreen"
                }`}
              >
                {typeof item.change === 'number' ? (item.change > 0 ? `+${item.change}` : item.change) : item.change}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-5/5">
            <Button variant="primary" onClick={handleStartNewSession} className="px-6 py-3 text-lg">
              Start Another Session
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#784E2F]">
          <span>Enjoying Nestify?</span>
          <a href="https://buymeacoffee.com/nestify" target="_blank" className="text-[#784E2F] hover:underline">
            Make a small donation
          </a>
          <Heart size={16} className="text-[#784E2F]" />
        </div>
      </div>
    </div>
  );
}