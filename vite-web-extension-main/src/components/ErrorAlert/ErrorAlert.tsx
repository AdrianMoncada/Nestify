import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
interface ErrorAlertProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  if (!isVisible) return null;
  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] z-[9999] scale-90">
      <div
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="flex items-center gap-3 w-full bg-white/70 border border-[#8B4513] rounded-lg p-4 shadow-lg animate-in fade-in slide-in-from-top duration-300 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <AlertCircle className="w-6 h-6 text-[#8B4513] flex-shrink-0" />
        <p className="text-gray-700 flex-grow text-base">{message}</p>
      </div>
    </div>
  );
};
