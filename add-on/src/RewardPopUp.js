import React from "react";
import { Leaf, Feather, Bird, Home, X } from "lucide-react";
import { AnimatedCounter } from "./components/AnimatedCounter";
export function App() {
  return (
    <div className="w-[400px] h-[550px] bg-white relative">
      <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
        <X className="w-5 h-5" />
      </button>
      <div className="h-full flex flex-col p-6 gap-8">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-center mb-4">
            Session Completed!
          </h1>
          <div className="w-[150px] h-[150px] bg-gray-100 rounded-lg" />
        </div>
        <p className="text-gray-600 text-center text-sm px-4">
          You've built 1 <Home className="w-4 h-4 text-blue-600 inline mx-1" />
          and increased your{" "}
          <span className="inline-flex items-center">
            <Bird className="w-4 h-4 text-amber-500 mx-1" />
          </span>
          possible population by{" "}
          <span className="text-green-500 font-medium">5</span>
        </p>
        <div className="w-full max-w-[300px] mx-auto">
          <div className="grid grid-cols-2 gap-6">
            <div
              className="flex items-center space-x-3 group relative"
              title="Resource Counter: Tracks your accumulated leaf resources"
            >
              <Leaf className="w-6 h-6 text-green-600" />
              <div className="bg-gray-50 rounded-lg w-[60px] h-[36px] flex items-center justify-center">
                <AnimatedCounter end={12} className="text-lg font-semibold" />
              </div>
              <span className="text-gray-400 text-sm">+0</span>
              <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 w-40 text-center">
                Counter Description
              </div>
            </div>
            <div
              className="flex items-center space-x-3 group relative"
              title="Resource Counter: Tracks your accumulated feather resources"
            >
              <Feather className="w-6 h-6 text-purple-600" />
              <div className="bg-gray-50 rounded-lg w-[60px] h-[36px] flex items-center justify-center">
                <AnimatedCounter end={24} className="text-lg font-semibold" />
              </div>
              <span className="text-gray-400 text-sm">+0</span>
              <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 w-40 text-center">
                Counter Description
              </div>
            </div>
            <div
              className="flex items-center space-x-3 group relative"
              title="Resource Counter: Tracks your total nests built"
            >
              <Home className="w-6 h-6 text-blue-600" />
              <div className="bg-gray-50 rounded-lg w-[60px] h-[36px] flex items-center justify-center">
                <AnimatedCounter end={8} className="text-lg font-semibold" />
              </div>
              <span className="text-green-500 text-sm">+1</span>
              <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 w-40 text-center">
                Counter Description
              </div>
            </div>
            <div
              className="flex items-center space-x-3 group relative"
              title="Resource Counter: Tracks your bird population capacity"
            >
              <Bird className="w-6 h-6 text-amber-500" />
              <div className="bg-gray-50 rounded-lg w-[60px] h-[36px] flex items-center justify-center">
                <span className="text-lg font-semibold">
                  <AnimatedCounter end={16} className="text-lg font-semibold" />
                  /16
                </span>
              </div>
              <span className="text-green-500 text-sm">+5</span>
              <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 w-40 text-center">
                Counter Description
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 mt-auto">
          <button className="w-[350px] h-[50px] bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
            Start Another Session
          </button>
          <p className="text-sm text-gray-600">
            Enjoying Nestify?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Make a small donation
            </a>{" "}
            💙
          </p>
        </div>
      </div>
    </div>
  );
}