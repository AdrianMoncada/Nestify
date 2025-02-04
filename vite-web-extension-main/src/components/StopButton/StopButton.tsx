import React from "react";
import { X } from "lucide-react";
import { Tooltip } from "../Tooltip/tooltip-component";
interface StopButtonProps {
  onClick: () => void;
}
export const StopButton: React.FC<StopButtonProps> = ({ onClick }) => {
  return (
    <Tooltip content="Stop current focus session">
      <button
        onClick={onClick}
        className={`
          group w-12 h-12 rounded-2xl
          flex items-center justify-center
          border-2 border-[#784E2F] bg-white 
          transition-all duration-75
          shadow-[0_6px_0_#784E2F] hover:shadow-[0_6px_0_#957F66]
          hover:border-[#957F66]
          active:translate-y-1.5 active:shadow-none
          active:border-red-500 active:ring-2 active:ring-red-500/50 active:ring-offset-1 active:ring-offset-transparent
        `}
      >
        Stop Focus Session
      </button>
    </Tooltip>
  );
};
