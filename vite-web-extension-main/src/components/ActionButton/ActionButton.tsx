import React, { useState } from 'react';
import { Leaf, Home, Egg } from 'lucide-react';
import { Tooltip } from '../../components/Tooltip/tooltip-component';

const actionIcons = {
  leaf: Leaf,
  home: Home,
  egg: Egg
};

const tooltipContent = {
  home: "• Build: Use resources to expand your ecosystem",
  leaf: "• Gather: Collect resources for your ecosystem",
  egg: "• Hatch: Use magic feathers to get new birds"
};

interface ActionButtonProps {
  action: 'leaf' | 'home' | 'egg';
  selectedAction: string;
  onClick: () => void;
  isValid: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  selectedAction,
  onClick,
  isValid
}) => {
  const Icon = actionIcons[action];
  const isSelected = selectedAction === action;
  const [isShaking, setIsShaking] = useState(false);
  
  const handleClick = () => {
    if (!isValid) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 820);
    }
    onClick();
  };

  // Estilos base
  const baseStyle = "border-2 border-brown bg-white transition-all";
  
  // Sombra y hover
  const shadowStyle = isSelected && isValid
    ? "translate-y-1.5 shadow-none"
    : isShaking
      ? "shadow-[0_6px_0_#B33B3B] hover:shadow-[0_6px_0_#B33B3B]" // Sombra roja en estado inválido
      : "shadow-[0_6px_0_#784E2F] hover:shadow-[0_6px_0_#957F66]";
  
  // Estilo activo
  const activeStyle = isSelected && isValid
    ? "border-yellowLight ring-2 ring-yellow/50 ring-offset-1 ring-offset-transparent" 
    : isShaking
      ? "border-red hover:border-red" // Borde rojo en hover durante shake
      : "hover:border-lightBrown";
  
  // Estilo del ícono
  const iconStyle = isSelected && isValid
    ? "text-yellowLight"
    : isShaking
      ? "text-red group-hover:text-red" // Ícono rojo en hover durante shake
      : "text-brown group-hover:text-lightBrown";
  
  // Animación de shake
  const shakeStyle = isShaking ? "animate-shake" : "";

  return (
    <Tooltip
      content={tooltipContent[action]}
      variant="informative"
      position="bottom"
    >
      <button
        onClick={handleClick}
        className={`
          group w-12 h-12 rounded-2xl 
          flex items-center justify-center 
          ${baseStyle} 
          ${shadowStyle} 
          ${activeStyle} 
          ${shakeStyle}
        `}
      >
        <Icon className={`
          w-6 h-6 transition-colors 
          ${iconStyle}
        `} />
      </button>
    </Tooltip>
  );
};

export default ActionButton;