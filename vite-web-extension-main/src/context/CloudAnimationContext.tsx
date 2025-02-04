import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CloudAnimationContextType {
  cloudsMoving: boolean;
  setCloudsMoving: (moving: boolean) => void;
}

const CloudAnimationContext = createContext<CloudAnimationContextType | undefined>(undefined);

export function CloudAnimationProvider({ children }: { children: ReactNode }) {
  const [cloudsMoving, setCloudsMoving] = useState(true);

  return (
    <CloudAnimationContext.Provider value={{ cloudsMoving, setCloudsMoving }}>
      {children}
    </CloudAnimationContext.Provider>
  );
}

export function useCloudAnimation() {
  const context = useContext(CloudAnimationContext);
  if (context === undefined) {
    throw new Error('useCloudAnimation must be used within a CloudAnimationProvider');
  }
  return context;
}
