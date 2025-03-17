import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainIcon, BriefcaseIcon, PencilIcon, CoffeeIcon, BookOpenIcon } from 'lucide-react';
import { SessionType } from './types';
interface SessionTypeOptionProps {
  type: SessionType;
  onClick: () => void;
}
const iconMap = {
  'deep-focus': BrainIcon,
  work: BriefcaseIcon,
  writing: PencilIcon,
  break: CoffeeIcon,
  study: BookOpenIcon
};
export const SessionTypeOption: React.FC<SessionTypeOptionProps> = ({
  type,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[type.id as keyof typeof iconMap];
  return <motion.div onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} onClick={onClick} className={`w-20 h-8 rounded flex items-center justify-center bg-white/50 transition-all duration-200 cursor-pointer`}>
      <AnimatePresence mode="wait">
        {isHovered ? <motion.span key="text" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className={`text-xs font-medium ${type.iconColor} text-center`}>
            {type.name}
          </motion.span> : <motion.div key="icon" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <Icon className={`w-5 h-5 ${type.iconColor}`} />
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
};