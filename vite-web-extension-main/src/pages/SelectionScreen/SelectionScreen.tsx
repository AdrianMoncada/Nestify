import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button/Button";
import { CarouselButton } from "../../components/CarouselButton/CarouselButton";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { TimerDisplay } from "../../components/TimerDisplay/TimerDisplay";
import { TimerButton } from "../../components/TimerButton/TimerButton";
import { Eye, Backpack, Wind, HousePlus } from 'lucide-react';
import { Tooltip } from "../../components/Tooltip/tooltip-component";
import { SessionState } from "../../types/session-types";
import { mockDb, Species, Ecosystem } from "../../mockDatabase/mock-database";
import { FloatingHeader } from "../../components/FloatingHeader/floating-header";
import { ErrorAlert} from "../../components/ErrorAlert/ErrorAlert";

// Bird role configuration
const BIRD_ROLES = {
  "Robin": { 
    role: "Glider",
    roleIcon: <Wind className="w-4 h-4 text-brown" />,
    tooltip: "No special abilities.",
    getImage: () => import("../../assets/img/Robin.png")
  },
  "Crow": { 
    role: "Searcher",
    roleIcon: <Eye className="w-4 h-4 text-brown" />,
    tooltip: "Finds more magical feathers.",
    getImage: () => import("../../assets/img/Crow.png")
  },
  "Hornero": { 
    role: "Nester",
    roleIcon: <HousePlus className="w-4 h-4 text-brown" />,
    tooltip: "Builds bigger nests.",
    getImage: () => import("../../assets/img/Hornero.png")
  },
  "Pelican": { 
    role: "Gatherer",
    roleIcon: <Backpack className="w-4 h-4 text-brown" />,
    tooltip: "Collects extra resources.",
    getImage: () => import("../../assets/img/Pelican.png")
  }
};

const TIMER_OPTIONS = [10, 15, 20, 25, 30];
const ACTIONS = ["Build", "Gather", "Hatch"] as const;
type ActionType = typeof ACTIONS[number];

// Define interface for stored state
interface StoredState {
  currentBirdIndex: number;
  selectedAction: ActionType;
  timer: number;
}

export default function SelectionScreen() {
  const navigate = useNavigate();
  const [currentBirdIndex, setCurrentBirdIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<ActionType>("Gather");
  const [timer, setTimer] = useState(25);
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<number | null>(null);
  
  // New states for mock database integration
  const [ecosystem, setEcosystem] = useState<Ecosystem | null>(null);
  const [userSpecies, setUserSpecies] = useState<Species[]>([]);
  const [birdImages, setBirdImages] = useState<Record<string, string>>({});

  // Load stored state on initial render
  useEffect(() => {
    const loadStoredState = async () => {
      try {
        const result = await chrome.storage.local.get(['selectionState']);
        if (result.selectionState) {
          const storedState: StoredState = result.selectionState;
          setCurrentBirdIndex(storedState.currentBirdIndex);
          // Validate the stored action before setting it
          if (ecosystem && validateAction(storedState.selectedAction)) {
            setSelectedAction(storedState.selectedAction);
          } else if (ecosystem) {
            // Set a valid default action if the stored one is invalid
            const validAction = findValidDefaultAction(ecosystem);
            setSelectedAction(validAction);
          }
          setTimer(storedState.timer);
        }
      } catch (error) {
        console.error('Error loading stored state:', error);
      }
    };

    loadStoredState();
  }, [ecosystem]); // Add ecosystem as dependency

  // Save state changes to storage
  useEffect(() => {
    const saveState = async () => {
      try {
        await chrome.storage.local.set({
          selectionState: {
            currentBirdIndex,
            selectedAction,
            timer,
          },
        });
      } catch (error) {
        console.error('Error saving state:', error);
      }
    };

    saveState();
  }, [currentBirdIndex, selectedAction, timer]);

  // Find a valid default action based on ecosystem state
  const findValidDefaultAction = (eco: Ecosystem): ActionType => {
    // Default to "Gather" as it usually doesn't require resources
    if (validateActionWithEcosystem("Gather", eco)) return "Gather";
    
    // Try other actions if "Gather" is somehow invalid
    for (const action of ACTIONS) {
      if (validateActionWithEcosystem(action, eco)) return action;
    }
    
    // Fallback to "Gather" if no valid actions found (unlikely)
    return "Gather";
  };

  // Load ecosystem and species data
  useEffect(() => {
    const loadData = async () => {
      const [eco, species] = await Promise.all([
        mockDb.getEcosystem("user1"),
        mockDb.getUserSpecies("user1")
      ]);
      setEcosystem(eco);
      setUserSpecies(species);

      // Set default valid action when ecosystem is loaded
      if (eco) {
        const validAction = findValidDefaultAction(eco);
        setSelectedAction(validAction);
      }
    };
    loadData();
  }, []);

  // Load bird images
  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, string> = {};
      for (const bird of userSpecies) {
        if (BIRD_ROLES[bird.name]) {
          const imageModule = await BIRD_ROLES[bird.name].getImage();
          images[bird.name] = imageModule.default;
        }
      }
      setBirdImages(images);
    };
    if (userSpecies.length > 0) {
      loadImages();
    }
  }, [userSpecies]);

  const handleTimerAdjust = (amount: number) => {
    const newIndex = TIMER_OPTIONS.indexOf(timer) + Math.sign(amount);
    if (newIndex >= 0 && newIndex < TIMER_OPTIONS.length) {
      setTimer(TIMER_OPTIONS[newIndex]);
    }
  };

  const validateActionWithEcosystem = (action: ActionType, eco: Ecosystem): boolean => {
    switch (action) {
      case "Hatch":
        return eco.feathers >= 1 && eco.population < eco.max_population;
      case "Build":
        return eco.resources >= 1;
      case "Gather":
        return true;
      default:
        return false;
    }
  };

  const validateAction = (action: ActionType): boolean => {
    if (!ecosystem) return false;
    return validateActionWithEcosystem(action, ecosystem);
  };

  const handleActionSelection = (action: ActionType) => {
    // Clear any previous errors
    setError(null);
    
    // Check if the action is valid
    if (validateAction(action)) {
      setSelectedAction(action);
    } else {
      // Show appropriate error message
      switch (action) {
        case "Hatch":
          if (ecosystem?.feathers as number < 1) {
            setError("Not enough feathers to hatch.");
          } else if (ecosystem?.population as number >= ecosystem?.max_population as number) {
            setError("Population limit reached.");
          }
          break;
        case "Build":
          setError("Not enough resources to build.");
          break;
        default:
          setError(`Cannot perform ${action}: insufficient resources.`);
      }
      
      // Don't update selectedAction for invalid actions
      // selectedAction remains unchanged
    }
  };

  const handleStartSession = async () => {
    if (!ecosystem || userSpecies.length === 0) return;
    
    // Final validation check
    if (!validateAction(selectedAction)) {
      setError(`Cannot start session: ${selectedAction} action is invalid with current resources.`);
      return;
    }

    try {
      const currentBird = userSpecies[currentBirdIndex];
      const birdRole = BIRD_ROLES[currentBird.name];
      
      // Create a session first via mockDb to check for errors
      const sessionData = {
        user_id: "user1",
        specie_id: currentBird.id,
        action: selectedAction.toLowerCase(),
        duration: timer * 60, // Convert to seconds
        completed: false,
        cancelled: false,
        start_time: new Date()
      };
      
      // This will throw an error if validation fails
      await mockDb.createSession(sessionData);
      
      const session: SessionState = {
        selectedBird: {
          id: currentBird.id,
          name: currentBird.name,
          role: birdRole.role,
          roleIcon: birdRole.roleIcon,
          tooltip: birdRole.tooltip,
          image: birdImages[currentBird.name]
        },
        selectedAction,
        selectedTime: timer
      };
      
      navigate('/timer', { state: session });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const BirdCard = () => {
    if (!userSpecies.length || !birdImages[userSpecies[currentBirdIndex].name]) {
      return <div>Loading...</div>;
    }

    const currentBird = userSpecies[currentBirdIndex];
    const birdRole = BIRD_ROLES[currentBird.name];

    return (
      <div className="bg-sky-100/30 backdrop-blur-sm rounded-2xl p-2 w-[280px]">
        <div className="relative">
          <div className="w-[180px] h-[180px] rounded-xl overflow-hidden">
            <img
              src={birdImages[currentBird.name]}
              alt={currentBird.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-5 left-[160px] flex flex-col gap-0.5">
            <h2 className="text-xl font-medium text-[#784E2F]">
              {currentBird.name}
            </h2>
            <Tooltip content={birdRole.tooltip}>
              <div className="h-8 min-w-[6rem] px-2 rounded-xl flex items-center justify-center gap-1.5 bg-white transition-all cursor-help">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {birdRole.roleIcon}
                </div>
                <span className="text-sm text-[#784E2F] truncate">
                  {birdRole.role}
                </span>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Floating error message */}
      {error && (
        <ErrorAlert 
          message={error} 
          duration={3000} 
          onClose={() => setError(null)}
        />
      )}
      
      {ecosystem && (
        <FloatingHeader
          stats={{
            nests: ecosystem.nests,
            population: ecosystem.population,
            feathers: ecosystem.feathers,
            resources: ecosystem.resources,
          }}
        />
      )}
      <div className="relative z-10">
        <h1 className="text-center text-xl font-medium mb-2 mt-3 text-brown">
          Select Your Bird
        </h1>

        <div className="flex items-center justify-center gap-2 mb-2">
          <CarouselButton 
            direction="prev" 
            onClick={() => setCurrentBirdIndex((prev) => (prev - 1 + userSpecies.length) % userSpecies.length)}
          />
          <BirdCard />
          <CarouselButton 
            direction="next" 
            onClick={() => setCurrentBirdIndex((prev) => (prev + 1) % userSpecies.length)}
          />
        </div>

        <div className="flex justify-center gap-3 mb-2">
          {userSpecies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBirdIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentBirdIndex === index ? "bg-yellow" : "bg-white"
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
              onClick={() => handleActionSelection(action)}
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
            <Button 
              variant="primary" 
              onClick={handleStartSession}
              disabled={!ecosystem || userSpecies.length === 0 || !validateAction(selectedAction)}
            >
              Start Focus Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}