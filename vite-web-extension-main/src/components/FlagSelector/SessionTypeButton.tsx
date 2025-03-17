import React from 'react';
import { FlagIcon } from 'lucide-react';
import { SessionType } from './types';
interface SessionTypeButtonProps {
  selected?: SessionType;
  onClick: () => void;
  isInvalid?: boolean;
}
export const SessionTypeButton: React.FC<SessionTypeButtonProps> = ({
  selected,
  onClick,
  isInvalid
}) => {
  const buttonClasses = `
    absolute z-50 top-0 left-3 w-9 h-9 rounded-xl border-2 bg-white flex items-center justify-center
    ${isInvalid ? 'border-red-500 shadow-[0_6px_0_#B33B3B]' : 'border-[#784E2F] shadow-[0_6px_0_#784E2F]'}
    transition-all duration-75
    active:translate-y-1.5 active:shadow-[0_2px_0_#784E2F]
    hover:border-[#957F66] hover:shadow-[0_6px_0_#957F66]
  `;
  const iconClasses = `
    w-5 h-5
    ${isInvalid ? 'text-red-500 group-hover:text-red-500' : selected ? selected.iconColor : 'text-[#784E2F] group-hover:text-[#957F66]'}
  `;
  return <button onClick={onClick} className={`group ${buttonClasses}`}>
      <FlagIcon className={iconClasses} />
    </button>;
};