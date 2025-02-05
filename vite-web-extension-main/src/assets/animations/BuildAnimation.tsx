import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  width: number;
  isDust: boolean;
}

export function BuildAnimation() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [nestOpacity, setNestOpacity] = useState(0.3);
  const [isResetting, setIsResetting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [movementDuration, setMovementDuration] = useState(1000);
  const [shakeKey, setShakeKey] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const getRandomPosition = () => {
    const range = 50;
    return {
      x: Math.random() * range - range / 2,
      y: Math.random() * range - range / 2,
    };
  };

  const createParticles = (birdX: number, birdY: number) => {
    const newParticles = [
      ...Array.from(
        {
          length: 4,
        },
        (_, i) => ({
          id: Date.now() + i,
          x: birdX + (Math.random() * 40 - 20),
          y: birdY + (Math.random() * 40 - 20),
          rotation: Math.random() * 360,
          width: Math.random() * 3 + 2,
          isDust: false,
        }),
      ),
      ...Array.from(
        {
          length: 6,
        },
        (_, i) => ({
          id: Date.now() + i + 100,
          x: birdX + (Math.random() * 40 - 20),
          y: birdY + (Math.random() * 40 - 20),
          rotation: Math.random() * 360,
          width: Math.random() * 2 + 1,
          isDust: true,
        }),
      ),
    ];
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
      );
    }, 1000);
  };

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const newPos = getRandomPosition();
      setPosition(newPos);
      setMovementDuration(800 + Math.random() * 600);
      createParticles(newPos.x, newPos.y);
      setShakeKey((prev) => prev + 1);
      setIsFlipped(Math.random() > 0.5);
      setNestOpacity((prev) => {
        if (prev >= 1) {
          setIsResetting(true);
          setTimeout(() => {
            setNestOpacity(0.3);
            setIsResetting(false);
          }, 1000);
          return prev;
        }
        return prev + 0.1;
      });
    }, 3000);
    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[288px] h-[288px] rounded-full overflow-hidden">
          <style>
            {`
              @keyframes working {
                0%, 100% { transform: translate(calc(-50% + ${position.x}px), ${position.y}px) rotate(-2deg) scaleX(${isFlipped ? -1 : 1}); }
                25% { transform: translate(calc(-50% + ${position.x}px), ${position.y - 4}px) rotate(0deg) scaleX(${isFlipped ? -1 : 1}); }
                75% { transform: translate(calc(-50% + ${position.x}px), ${position.y}px) rotate(2deg) scaleX(${isFlipped ? -1 : 1}); }
              }
              @keyframes particleFade {
                0% { opacity: 0.8; transform: translate(0, 0) rotate(0deg) scale(1); }
                100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--rotate)) scale(0.5); }
              }
              @keyframes nestShake {
                0%, 100% { transform: translate(-50%, 0); }
                25% { transform: translate(calc(-50% + 2px), 1px); }
                50% { transform: translate(calc(-50% - 2px), -1px); }
                75% { transform: translate(calc(-50% + 1px), 1px); }
              }
            `}
          </style>
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute"
              style={
                {
                  left: `calc(50% + ${particle.x}px)`,
                  bottom: `${120 + particle.y}px`,
                  width: particle.isDust ? "2px" : `${particle.width}px`,
                  height: particle.isDust ? "2px" : "1px",
                  backgroundColor: particle.isDust ? "#D4B59480" : "#8B4513",
                  borderRadius: particle.isDust ? "50%" : "0",
                  transform: `rotate(${particle.rotation}deg)`,
                  opacity: 0,
                  "--dx": `${Math.random() * 30 - 15}px`,
                  "--dy": `${-Math.random() * 30}px`,
                  "--rotate": `${Math.random() * 360}deg`,
                  animation: "particleFade 1s ease-out forwards",
                } as any
              }
            />
          ))}
          <img
            src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/318d23b8-5e6e-40d9-a17f-b9a3c1134969/dj1o1ky-7662d5a3-36b4-42ab-a773-f1ace6d2899c.png/v1/fill/w_282,h_258/red_bird_facing_back_by_blueytigercarlos2009_dj1o1ky-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjU4IiwicGF0aCI6IlwvZlwvMzE4ZDIzYjgtNWU2ZS00MGQ5LWExN2YtYjlhM2MxMTM0OTY5XC9kajFvMWt5LTc2NjJkNWEzLTM2YjQtNDJhYi1hNzczLWYxYWNlNmQyODk5Yy5wbmciLCJ3aWR0aCI6Ijw9MjgyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.FEEwuX8nI1iI989Yt9igK7m-PyQLp9l3c4BcogRAuAQ"
            alt="Red bird viewed from behind"
            className="absolute w-[102px] left-1/2 bottom-[120px] z-10"
            style={{
              animation: "working 1.5s ease-in-out infinite",
              transition: `all ${movementDuration}ms ease-in-out`,
            }}
          />
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/chicken-eggs-in-the-nest-illustration-download-svg-png-gif-file-formats--egg-goose-breeding-poultry-species-pack-animal-illustrations-10960751.png?f=webp"
            alt="Bird nest"
            className="absolute w-[500px] left-1/2 -translate-x-1/2 bottom-2 transition-opacity duration-1000"
            style={{
              opacity: isResetting ? 0 : nestOpacity,
              animation: `nestShake 0.3s ease-out ${shakeKey}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}