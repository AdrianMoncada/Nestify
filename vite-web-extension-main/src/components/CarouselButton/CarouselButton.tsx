import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
}

export const CarouselButton: React.FC<CarouselButtonProps> = ({ direction, onClick }) => {
  const baseButtonStyle = "border-2 border-brown transition-all active:shadow-[0_0_0_darkBrown] active:translate-y-[5px]";
  const yellowButtonStyle = `${baseButtonStyle} hover:border-lightBrown bg-white shadow-[0_5px_0_#784E2F] hover:shadow-[0_5px_0_#957F66]`;

  return (
    <button
      onClick={onClick}
      className={`${yellowButtonStyle} w-10 h-10 rounded-2xl flex items-center justify-center active:translate-y-[6px]`}
    >
      {direction === 'prev' ? (
        <ChevronLeft className="w-6 h-6 text-brown transition-colors hover:text-lightBrown" />
      ) : (
        <ChevronRight className="w-6 h-6 text-brown transition-colors hover:text-lightBrown" />
      )}
    </button>
  );
};
