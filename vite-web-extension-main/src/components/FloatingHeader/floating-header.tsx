import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Bird, Home, Feather, Leaf } from "lucide-react";
import { Tooltip } from "../Tooltip/tooltip-component";

interface Stats {
  nests: number;
  population: number;
  maxPopulation: number;
  feathers: number;
  resources: number;
}

interface FloatingHeaderProps {
  stats: Stats;
  descriptions?: {
    nests?: string;
    population?: string;
    maxPopulation?: string;
    feathers?: string;
    resources?: string;
  };
}

// interface TooltipProps {
//   content: string;
//   children: React.ReactNode;
// }

// const Tooltip = ({ content, children }: TooltipProps) => {
//   return (
//     <div className="group relative">
//       {children}
//       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[8px] text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//         {content}
//       </div>
//     </div>
//   );
// };

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({ 
  stats,
  descriptions = {
    nests: "Total nests built",
    population: "Population and max population",
    feathers: "Available feathers",
    resources: "Available resources",
  }
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el click fue en el botón, ignoramos el evento
      if (buttonRef.current?.contains(event.target as Node)) {
        return;
      }
      
      // Si el panel está abierto y el click no fue dentro del panel, lo cerramos
      if (isOpen && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed right-0 top-1/2 w-[100px] h-[187px] z-50">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-l-xl shadow-md hover:bg-white/90 transition-colors z-50 cursor-pointer border-2 border-[#784E2F] border-r-0"
      >
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <ChevronLeft className="w-4 h-4 text-[#784E2F]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="absolute right-0 top-0 h-[187px] w-[120px] bg-white/50 backdrop-blur-sm shadow-lg rounded-l-xl p-3 border-2 border-[#784E2F] border-r-0"
          >
            <div className="flex flex-col justify-between h-full">
              <Tooltip position="left" content={descriptions.nests || ""}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-[#784E2F] shadow-[0_2px_0_#9ca3af] hover:bg-gray-300 transition-colors cursor-help">
                    <Home className="w-4 h-4 text-[#784E2F]" />
                  </div>
                  <div className="bg-white rounded-lg px-2 py-0.5 min-w-[32px] flex justify-center">
                    <span className="font-medium text-sm text-[#784E2F]">
                      {stats.nests}
                    </span>
                  </div>
                </div>
              </Tooltip>
              <Tooltip position="left" content={descriptions.population || ""}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-[#784E2F] shadow-[0_2px_0_#9ca3af] hover:bg-gray-300 transition-colors cursor-help">
                    <Bird className="w-4 h-4 text-[#784E2F]" />
                  </div>
                  <div className="bg-white rounded-lg px-2 py-0.5 min-w-[32px] flex justify-center">
                    <span className="font-medium tex-sm text-[#784E2F]">
                      {stats.population}/{stats.maxPopulation}
                    </span>
                  </div>
                </div>
              </Tooltip>
              <Tooltip position="left" content={descriptions.feathers || ""}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-[#784E2F] shadow-[0_2px_0_#9ca3af] hover:bg-gray-300 transition-colors cursor-help">
                    <Feather className="w-4 h-4 text-[#784E2F]" />
                  </div>
                  <div className="bg-white rounded-lg px-2 py-0.5 min-w-[32px] flex justify-center">
                    <span className="font-medium text-sm text-[#784E2F]">
                      {stats.feathers}
                    </span>
                  </div>
                </div>
              </Tooltip>
              <Tooltip position="left" content={descriptions.resources || ""}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-[#784E2F] shadow-[0_2px_0_#9ca3af] hover:bg-gray-300 transition-colors cursor-help">
                    <Leaf className="w-4 h-4 text-[#784E2F]" />
                  </div>
                  <div className="bg-white rounded-lg px-2 py-0.5 min-w-[32px] flex justify-center">
                    <span className="font-medium text-sm text-[#784E2F]">
                      {stats.resources}
                    </span>
                  </div>
                </div>
              </Tooltip>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
