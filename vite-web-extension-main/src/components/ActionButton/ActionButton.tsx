import React from 'react';
import { Leaf, Home, Egg } from 'lucide-react';
import { Tooltip } from '../../components/Tooltip/tooltip-component';

const actionIcons = {
  leaf: Leaf,
  home: Home,
  egg: Egg
};

const tooltipContent = {
  home: "Build nests using gathered materials to expand your ecosystem for more birds",
  leaf: "Gather resources to grow your ecosystem",
  egg: "Hatch eggs using magical feathers to add new birds to your ecosystem"
};

interface ActionButtonProps {
  action: 'leaf' | 'home' | 'egg';
  selectedAction: string;
  onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  selectedAction,
  onClick
}) => {
  const Icon = actionIcons[action];
  const isSelected = selectedAction === action;
  
  const baseStyle = "border-2 border-brown bg-white transition-all";
  const shadowStyle = isSelected
    ? "translate-y-1.5 shadow-none"
    : "shadow-[0_6px_0_#784E2F] hover:shadow-[0_6px_0_#957F66]";
  const activeStyle = isSelected
    ? "border-yellowLight ring-2 ring-yellow/50 ring-offset-1 ring-offset-transparent" 
    : "hover:border-lightBrown";
  const iconStyle = isSelected
    ? "text-yellowLight"
    : "text-brown group-hover:text-lightBrown";

  return (
    <Tooltip
      content={tooltipContent[action]}
      variant="informative"
      position="bottom"
    >
      <button
        onClick={onClick}
        className={`group w-14 h-14 rounded-2xl flex items-center justify-center ${baseStyle} ${shadowStyle} ${activeStyle}`}
      >
        <Icon className={`w-6 h-6 transition-colors ${iconStyle}`} />
      </button>
    </Tooltip>
  );
};

export default ActionButton;