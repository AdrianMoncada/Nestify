import React from 'react';
import { Leaf, Home, Egg } from 'lucide-react';

const actionIcons = {
  leaf: Leaf,
  home: Home,
  egg: Egg
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
  const baseStyle = "border-2 border-[#784E2F] transition-all shadow-[0_6px_0_#784E2F] active:translate-y-[6px] active:shadow-[0_0_0_#784E2F] hover:bg-yellowLight";
  const activeStyle = selectedAction === action ? "bg-yellow" : "bg-white";

  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${baseStyle} ${activeStyle}`}
    >
      <Icon className="w-6 h-6 text-brown" />
    </button>
  );
};