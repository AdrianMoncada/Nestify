import React, { useState } from "react";
import { Shield, X } from "lucide-react";
export function App() {
  const [isEnabled, setIsEnabled] = useState(true);
  return (
    <div className="flex w-full min-h-screen bg-black/20 items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-[400px] h-[550px] p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[#4A90E2] font-bold text-xl">Nestify</div>
          <button className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="w-full flex justify-center mb-6">
          <div className="w-32 h-32 bg-[#4A90E2] rounded-lg flex items-center justify-center text-white font-bold">
            MASCOT
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-center text-gray-800 truncate">
            Help Keep Nestify Free
          </h1>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 text-center">
              Share your unused bandwidth to keep Nestify free and support our
              growth. Your privacy remains protected.
            </p>
            <div className="flex items-center justify-center gap-1 text-sm text-[#4A90E2]">
              <Shield size={14} />
              <a href="#" className="hover:underline text-xs">
                See how it works
              </a>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-700">Enable Mellowtel</p>
              <p
                className={`text-sm mt-1 truncate w-48 ${isEnabled ? "text-green-600" : "text-gray-500"}`}
              >
                {isEnabled
                  ? "Thanks for your support!"
                  : "Enable anytime from settings"}
              </p>
            </div>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ease-in-out ${isEnabled ? "bg-green-500" : "bg-gray-300"}`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${isEnabled ? "translate-x-7" : "translate-x-0"}`}
              />
            </button>
          </div>
          <button className="w-full bg-[#4A90E2] text-white rounded-lg py-3 font-medium hover:shadow-md transition-shadow duration-200">
            Continue
          </button>
          <div className="text-center text-sm text-gray-600">
            Want to help even more?{" "}
            <a href="#" className="text-[#4A90E2] hover:underline">
              Make a small donation 💙
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
