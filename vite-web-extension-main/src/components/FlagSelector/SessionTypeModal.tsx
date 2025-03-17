import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionTypeOption } from './SessionTypeOption';
import { sessionTypes, SessionType } from './types';
interface SessionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: SessionType) => void;
}
export const SessionTypeModal: React.FC<SessionTypeModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  return <AnimatePresence>
      {isOpen && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="fixed inset-0 flex items-center justify-center bg-black/10" onClick={onClose}>
          <motion.div initial={{
        scale: 0.95,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0.95,
        opacity: 0
      }} onClick={e => e.stopPropagation()} className="bg-white/30 backdrop-blur-sm border-2 border-[#784E2F] shadow-sm rounded-lg p-4">
            <div className="flex flex-col gap-3">
              <div className="flex justify-center gap-3">
                {sessionTypes.slice(0, 3).map(type => <SessionTypeOption key={type.id} type={type} onClick={() => {
              onSelect(type);
              onClose();
            }} />)}
              </div>
              <div className="flex justify-center gap-3">
                {sessionTypes.slice(3).map(type => <SessionTypeOption key={type.id} type={type} onClick={() => {
              onSelect(type);
              onClose();
            }} />)}
              </div>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};