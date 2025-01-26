import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
}

export const CarouselButton: React.FC<CarouselButtonProps> = ({ direction, onClick }) => {
  const baseButtonStyle = "border-2 border-brown transition-all active:shadow-[0_0_0_darkBrown] active:translate-y-[6px]";
  const yellowButtonStyle = `${baseButtonStyle} hover:bg-yellowLight bg-yellow shadow-[0_6px_0_yellowDark]`;

  return (
    <button
      onClick={onClick}
      className={`${yellowButtonStyle} w-8 h-8 rounded-full flex items-center justify-center active:translate-y-[2px]`}
    >
      {direction === 'prev' ? (
        <ChevronLeft className="w-4 h-4 text-brown" />
      ) : (
        <ChevronRight className="w-4 h-4 text-brown" />
      )}
    </button>
  );
};
