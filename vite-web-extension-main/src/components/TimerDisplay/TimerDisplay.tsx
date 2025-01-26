import React from 'react';

interface TimerDisplayProps {
  timer: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer }) => {
  return (
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-medium text-brown">
      {timer}
    </div>
  );
};