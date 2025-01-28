import React from 'react';
import { Leaf, Home, Egg } from 'lucide-react';
import { Tooltip } from '../../components/Tooltip/tooltip-component';

const actionIcons = {
  leaf: Leaf,
  home: Home,
  egg: Egg
};

const tooltipContent = {
  home: "Build nests using gathered materials to expand your habitat for more birds.",
  leaf: "Gather resources to grow your ecosystem.",
  egg: "Hatch eggs using magical feathers to add new birds to your flock."
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
  const baseStyle = "border-2 border-brown transition-all";
  const shadowStyle = selectedAction === action
    ? "translate-y-1.5 shadow-none"
    : "shadow-[0_6px_0_#784E2F] hover:shadow-[0_4px_0_#784E2F] hover:translate-y-0.5";
  const activeStyle = selectedAction === action ? "bg-yellow" : "bg-white hover:bg-yellowLight";

  return (
    <Tooltip
      content={tooltipContent[action]}
      variant="informative"
      position="bottom"
    >
      <button
        onClick={onClick}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${baseStyle} ${shadowStyle} ${activeStyle}`}
      >
        <Icon className="w-6 h-6 text-brown" />
      </button>
    </Tooltip>
  );
};

export default ActionButton;