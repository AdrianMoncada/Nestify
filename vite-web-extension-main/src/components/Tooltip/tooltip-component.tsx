import React, { useState } from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

type TooltipVariant = "positive" | "negative" | "informative";
type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  variant?: TooltipVariant;
  position?: TooltipPosition;
  children: React.ReactNode;
}

export const Tooltip = ({
  content,
  variant = "informative",
  position = "top",
  children,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const getIcon = () => {
    switch (variant) {
      case "positive":
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case "negative":
        return <AlertCircle className="w-3 h-3 text-red-600" />;
      default:
        return <Info className="w-3 h-3 text-blue-600" />;
    }
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  // Determinar el ancho máximo basado en la longitud del contenido
  const getWidthClass = () => {
    const contentLength = content.length;
    if (contentLength < 10) return "w-20"; // Texto muy corto
    if (contentLength < 30) return "w-36"; // Texto corto
    if (contentLength < 70) return "w-52"; // Texto mediano
    return "w-72"; // Texto largo
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute z-10 ${getWidthClass()} max-w-sm ${positionClasses[position]}`}>
          <div className="bg-white border-2 border-[#8B4513] rounded-lg shadow-lg p-2 animate-fadeIn">
            <div className="flex items-start gap-1.5">
              {/* {getIcon()} */}
              <p className="text-sm text-brown">{content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
