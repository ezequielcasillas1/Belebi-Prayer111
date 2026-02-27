import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  // Add state and actions here as features are built
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
