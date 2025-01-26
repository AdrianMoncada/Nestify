import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface TimerButtonProps {
  type: 'plus' | 'minus';
  onClick: () => void;
}

export const TimerButton: React.FC<TimerButtonProps> = ({ 
  type, 
  onClick 
}) => {
  const baseStyle = "w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-[#784E2F] bg-[#FEC651] shadow-[0_6px_0_#784E2F] transition-all active:translate-y-[6px] active:shadow-[0_0_0_#784E2F]";

  return (
    <button
      onClick={onClick}
      className={baseStyle}
    >
      {type === 'plus' 
        ? <Plus className="w-6 h-6 text-brown" /> 
        : <Minus className="w-6 h-6 text-brown" />
      }
    </button>
  );
};