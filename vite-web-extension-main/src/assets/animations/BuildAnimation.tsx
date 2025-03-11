import React, { useEffect, useState, useRef } from "react";
import Nest from "../img/Nest.png";
import Bird from "../img/Bird.png";

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
  const isMoving = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const particleIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
          length: 10,
        },
        (_, i) => ({
          id: Date.now() + i,
          x: birdX + (Math.random() * 50 - 25),
          y: birdY + (Math.random() * 50 - 25),
          rotation: Math.random() * 360,
          width: Math.random() * 6 + 3,
          isDust: false,
        }),
      ),
      ...Array.from(
        {
          length: 15,
        },
        (_, i) => ({
          id: Date.now() + i + 100,
          x: birdX + (Math.random() * 50 - 25),
          y: birdY + (Math.random() * 50 - 25),
          rotation: Math.random() * 360,
          width: Math.random() * 4 + 2,
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

  // Función para iniciar la emisión continua de partículas
  const startParticleEmission = (x: number, y: number) => {
    // Limpiar cualquier intervalo existente
    if (particleIntervalRef.current) {
      clearInterval(particleIntervalRef.current);
    }
    
    // Crear partículas continuamente mientras se mueve
    particleIntervalRef.current = setInterval(() => {
      if (isMoving.current) {
        createParticles(x, y);
      }
    }, 100); // Generar partículas cada 100ms durante el movimiento
  };

  // Función para detener la emisión de partículas
  const stopParticleEmission = () => {
    if (particleIntervalRef.current) {
      clearInterval(particleIntervalRef.current);
      particleIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const newPos = getRandomPosition();
      
      // Marcar que el pájaro está empezando a moverse
      isMoving.current = true;
      lastPosition.current = newPos;
      
      // Iniciar la emisión de partículas
      startParticleEmission(newPos.x, newPos.y);
      
      setPosition(newPos);
      setMovementDuration(800 + Math.random() * 600);
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
      
      // Programar la detención de partículas después de la duración del movimiento
      setTimeout(() => {
        isMoving.current = false;
        stopParticleEmission();
      }, movementDuration);
      
    }, 3000);
    
    return () => {
      clearInterval(moveInterval);
      stopParticleEmission();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <style>
          {`
            @keyframes working {
              0%, 100% { transform: translate(calc(-50% + ${position.x}px), ${position.y}px) rotate(-2deg) scaleX(${isFlipped ? -1 : 1}); }
              25% { transform: translate(calc(-50% + ${position.x}px), ${position.y - 4}px) rotate(0deg) scaleX(${isFlipped ? -1 : 1}); }
              75% { transform: translate(calc(-50% + ${position.x}px), ${position.y}px) rotate(2deg) scaleX(${isFlipped ? -1 : 1}); }
            }
            @keyframes particleFade {
              0% { opacity: 0.9; transform: translate(0, 0) rotate(0deg) scale(1); }
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
                width: particle.isDust ? `${particle.width}px` : `${particle.width}px`,
                height: particle.isDust ? `${particle.width}px` : "1.5px",
                backgroundColor: particle.isDust ? "#D4B59480" : "#8B4513",
                borderRadius: particle.isDust ? "50%" : "0",
                transform: `rotate(${particle.rotation}deg)`,
                opacity: 0,
                "--dx": `${Math.random() * 40 - 20}px`,
                "--dy": `${-Math.random() * 40}px`,
                "--rotate": `${Math.random() * 360}deg`,
                animation: "particleFade 1s ease-out forwards",
              } as any
            }
          />
        ))}
        <img
          src={Bird}
          alt="Red bird viewed from behind"
          className="absolute w-[122px] left-1/2 bottom-[140px] z-10"
          style={{
            animation: "working 1.5s ease-in-out infinite",
            transition: `all ${movementDuration}ms ease-in-out`,
            zIndex: 2,
            bottom: "45px"
          }}
        />
        <img
          src={Nest}
          alt="Bird nest"
          className="absolute w-[204px] left-1/2 -translate-x-1/2 bottom-2 transition-opacity duration-1000"
          style={{
            opacity: isResetting ? 0 : nestOpacity,
            animation: `nestShake 0.3s ease-out ${shakeKey}`,
            zIndex: 1
          }}
        />
      </div>
    </div>
  );
}