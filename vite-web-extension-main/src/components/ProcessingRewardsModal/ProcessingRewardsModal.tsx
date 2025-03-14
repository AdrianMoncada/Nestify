import React from "react";
import { Hourglass } from "lucide-react";

interface ProcessingRewardsModalProps {
  isVisible: boolean;
}

const ProcessingRewardsModal: React.FC<ProcessingRewardsModalProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-lg border-2 border-[#784E2F]">
        <div className="animate-spin mb-4">
          <Hourglass size={32} className="text-[#784E2F]" />
        </div>
        <p className="text-lg font-medium text-[#784E2F]">Processing Rewards...</p>
      </div>
    </div>
  );
};

export default ProcessingRewardsModal;