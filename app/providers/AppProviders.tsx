import React, { ReactNode, useEffect } from 'react';
import { usePlanStore } from '../features/planning/stores/planStore';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const checkAutoExpiry = usePlanStore((state) => state.checkAutoExpiry);
  const checkPlanExpiry = usePlanStore((state) => state.checkPlanExpiry);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAutoExpiry();
      checkPlanExpiry();
    }, 60000);

    return () => clearInterval(interval);
  }, [checkAutoExpiry, checkPlanExpiry]);

  return <>{children}</>;
}

export default AppProviders;
