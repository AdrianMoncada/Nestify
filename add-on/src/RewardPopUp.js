import { Home, Feather, Bird, Leaf } from "lucide-react";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
const AnimatedNumber = ({ value }) => {
  return (
    <motion.span
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="text-sm text-green-500 ml-2"
    >
      +{value}
    </motion.span>
  );
};
export default function RewardModal() {
  const [sessionGains] = useState({
    trees: 3,
    feathers: 5,
    houses: 2,
    birds: 4,
  });
  const [counts, setCounts] = useState({
    trees: 0,
    feathers: 0,
    houses: 0,
    birds: 0,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        trees: prev.trees < 12 ? prev.trees + 1 : prev.trees,
        feathers: prev.feathers < 24 ? prev.feathers + 1 : prev.feathers,
        houses: prev.houses < 8 ? prev.houses + 1 : prev.houses,
        birds: prev.birds < 16 ? prev.birds + 1 : prev.birds,
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        className="bg-white rounded-xl shadow-xl w-[350px] h-[500px] p-6 flex flex-col items-center"
      >
        <motion.h1
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-2xl font-bold mb-8"
        >
          Nest Created!
        </motion.h1>

        <motion.div
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            type: "spring",
            duration: 0.8,
          }}
          className="mb-6"
        >
          <Home className="w-24 h-24 text-blue-600" />
        </motion.div>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
          }}
          className="text-center text-gray-600 mb-8 flex items-center justify-center flex-wrap gap-1"
        >
          You've built <span className="text-green-500 font-medium">1</span>{" "}
          <Home className="w-4 h-4 inline text-blue-600" /> and increased your{" "}
          <Bird className="w-4 h-4 inline text-yellow-600" /> possible
          population by <span className="text-green-500 font-medium">5</span>
        </motion.p>

        <div className="mt-auto w-full">
          <div className="grid grid-cols-2 gap-4 w-[280px] mx-auto">
            <div className="flex flex-col items-center justify-center h-20 bg-gray-50 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600 mb-2" />
              <div className="flex items-center">
                <div className="text-sm font-medium">{counts.trees}</div>
                <AnimatedNumber value={sessionGains.trees} />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-20 bg-gray-50 rounded-lg">
              <Feather className="w-6 h-6 text-purple-600 mb-2" />
              <div className="flex items-center">
                <div className="text-sm font-medium">{counts.feathers}</div>
                <AnimatedNumber value={sessionGains.feathers} />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-20 bg-gray-50 rounded-lg">
              <Home className="w-6 h-6 text-blue-600 mb-2" />
              <div className="flex items-center">
                <div className="text-sm font-medium">{counts.houses}</div>
                <AnimatedNumber value={sessionGains.houses} />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-20 bg-gray-50 rounded-lg">
              <Bird className="w-6 h-6 text-yellow-600 mb-2" />
              <div className="flex items-center">
                <div className="text-sm font-medium">{counts.birds}/16</div>
                <AnimatedNumber value={sessionGains.birds} />
              </div>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6"
        >
          Start Another Session
        </motion.button>
      </motion.div>
    </div>
  );
}
render(<RewardModal />, document.getElementById("root"));