import React from "react";
import Bird from "../../assets/img/BirdGlide.png";

export function AnimatedBird() {
  const styles = {
    birdFlight: {
      animation: "birdFlight 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
    },
    shadow: {
      animation: "shadowMove 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
    },
    trail: (delay: number) => ({
      animation: `trailBase 1.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite ${delay}s`,
    }),
    keyframes: `
      @keyframes birdFlight {
        0% { transform: translate(-20px, 10px) rotate(-2deg); }
        15% { transform: translate(-10px, -4px) rotate(0deg); }
        20% { transform: translate(0px, -8px) rotate(1deg); }
        30% { transform: translate(5px, 0px) rotate(360deg); }
        45% { transform: translate(0px, 5px) rotate(720deg); }
        60% { transform: translate(-5px, -4px) rotate(721deg); }
        75% { transform: translate(-10px, -8px) rotate(722deg); }
        85% { transform: translate(-15px, 0px) rotate(723deg); }
        100% { transform: translate(-20px, 10px) rotate(724deg); }
      }
      @keyframes shadowMove {
        0% { transform: translate(-20px, 40px) scale(0.9); opacity: 0.3; }
        15% { transform: translate(-10px, 40px) scale(0.8); opacity: 0.25; }
        20% { transform: translate(0px, 40px) scale(0.7); opacity: 0.2; }
        30% { transform: translate(5px, 40px) scale(0.6); opacity: 0.15; }
        45% { transform: translate(0px, 40px) scale(0.7); opacity: 0.2; }
        60% { transform: translate(-5px, 40px) scale(0.8); opacity: 0.25; }
        75% { transform: translate(-10px, 40px) scale(0.85); opacity: 0.27; }
        85% { transform: translate(-15px, 40px) scale(0.88); opacity: 0.29; }
        100% { transform: translate(-20px, 40px) scale(0.9); opacity: 0.3; }
      }
      @keyframes trailBase {
        0% { transform: translate(-20px, 10px) scale(0.8); opacity: 0.4; }
        15% { transform: translate(-15px, 8px) scale(0.6); opacity: 0.2; }
        30% { transform: translate(-10px, 5px) scale(0); opacity: 0; }
        100% { transform: translate(-10px, 5px) scale(0); opacity: 0; }
      }
    `,
  };

  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles.keyframes;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-gray-100"
          style={{
            filter: "blur(3px)",
            transformOrigin: "center",
            ...styles.trail(i * 0.3),
          }}
        />
      ))}
      <div
        className="absolute w-[60px] h-5 rounded-full bg-black/20"
        style={{
          filter: "blur(4px)",
          transformOrigin: "center",
          ...styles.shadow,
        }}
      />
      <img
        src={Bird}
        alt="Bird with spread wings viewed from behind"
        className="w-auto h-[120px] object-contain absolute"
        style={{
          transformOrigin: "center",
          ...styles.birdFlight,
        }}
      />
    </div>
  );
}
