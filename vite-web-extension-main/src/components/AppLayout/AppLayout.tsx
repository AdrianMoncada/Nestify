import React, { ReactNode } from 'react';
import CloudBackground from '../../assets/animations/CloudBackground';
import { useCloudAnimation } from '../../context/CloudAnimationContext';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { cloudsMoving } = useCloudAnimation();

  return (
    <div className="w-[400px] h-[550px] relative border-4 border-white rounded-[24px] overflow-hidden font-['Chilanka'] text-thicker">
      <div className="absolute inset-0 bg-blueSky z-0">
        <CloudBackground numberOfClouds={20} isMoving={cloudsMoving} />
      </div>
      <div className="relative z-10 w-full h-full border-2 border-brown rounded-[20px]">
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;