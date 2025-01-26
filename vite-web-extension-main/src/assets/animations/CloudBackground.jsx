import React, { useMemo } from 'react';
import '../styles/CloudBackground.css'

const CloudBackground = ({ numberOfClouds = 6 }) => {
  // Generamos las configuraciones de nubes de manera aleatoria
  const clouds = useMemo(() => {
    return Array.from({ length: numberOfClouds }, () => ({
      // Posición vertical aleatoria entre 10% y 90%
      top: Math.random() * 80 + 10,
      // Velocidad aleatoria entre 15s y 25s
      duration: Math.random() * 10 + 15,
      // Retraso aleatorio entre 0s y -15s para que no empiecen todas juntas
      delay: -Math.random() * 15,
      // Tamaño aleatorio entre 0.8 y 1.2 del tamaño original
      scale: 0.8 + Math.random() * 0.4,
      // Opacidad aleatoria entre 0.6 y 0.9
      opacity: Math.random() * 0.3 + 0.6
    }));
  }, [numberOfClouds]);

  return (
    <div className="cloud-background">
      {clouds.map((config, index) => (
        <div
          key={index}
          className="cloud"
          style={{
            top: `${config.top}%`,
            animation: `floatCloud ${config.duration}s linear infinite`,
            animationDelay: `${config.delay}s`,
            transform: `scale(${config.scale})`,
            opacity: config.opacity
          }}
        />
      ))}
    </div>
  );
};

export default CloudBackground;