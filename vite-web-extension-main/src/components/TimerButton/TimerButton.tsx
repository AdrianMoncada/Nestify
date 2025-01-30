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
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-2xl flex items-center justify-center border-2 border-[#784E2F] bg-white transition-all hover:border-lightBrown hover:shadow-[0_5px_0_#957F66] active:translate-y-[5px] active:shadow-[0_0_0_#784E2F] shadow-[0_5px_0_#784E2F]"
    >
      {type === 'plus' 
        ? <Plus className="w-6 h-6 text-brown transition-colors hover:text-lightBrown" />
        : <Minus className="w-6 h-6 text-brown transition-colors hover:text-lightBrown" />
      }
    </button>
  );
};

export default TimerButton;