import React, { useMemo } from 'react';
import '../styles/CloudBackground.css';

interface CloudBackgroundProps {
  numberOfClouds?: number;
  isMoving?: boolean;
}

const CloudBackground: React.FC<CloudBackgroundProps> = ({ 
  numberOfClouds = 6,
  isMoving = true 
}) => {
  const clouds = useMemo(() => {
    return Array.from({ length: numberOfClouds }, () => ({
      top: Math.random() * 80 + 10,
      delay: -Math.random() * 15,
      scale: 0.8 + Math.random() * 0.4,
    }));
  }, [numberOfClouds]);

  return (
    <div className={`cloud-background ${!isMoving ? 'paused' : ''}`}>
      {clouds.map((config, index) => (
        <div
          key={index}
          className="cloud"
          style={{
            top: `${config.top}%`,
            animationDelay: `${config.delay}s`,
            transform: `scale(${config.scale})`,
          }}
        />
      ))}
    </div>
  );
};

export default CloudBackground;