import React, { useEffect, useState } from "react";
import { render } from "react-dom";
export default function BouncingEgg() {
  const [rotation, setRotation] = useState(0);
  const maxRotation = 12;
  useEffect(() => {
    const animate = () => {
      const time = Date.now() / 1000;
      setRotation(Math.sin(time * 2) * maxRotation);
    };
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center justify-center min-h-[200px] bg-white">
      <div
        className="relative w-[150px] h-[150px] rounded-full border-2 border-gray-200 overflow-hidden"
        role="presentation"
      >
        <div
          className="absolute text-4xl"
          style={{
            top: "50%",
            left: "50%",
            marginTop: "-0.6em",
            marginLeft: "-0.6em",
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "bottom center",
            opacity: 0.8 + Math.abs(Math.sin(rotation * (Math.PI / 180)) * 0.2),
          }}
          aria-hidden="true"
        >
          🥚
        </div>
      </div>
    </div>
  );
}
render(<BouncingEgg />, document.getElementById("root"));
