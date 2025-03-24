"use client";

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { checkAuthState } from '@/store/features/auth/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Delay initial auth check to prevent immediate logout after login
    const initialCheckTimeout = setTimeout(() => {
      store.dispatch(checkAuthState());
    }, 3000); // 3 second delay

    // Set up periodic token validation (every 5 minutes instead of every minute)
    const interval = setInterval(() => {
      store.dispatch(checkAuthState());
    }, 300000); // 5 minutes

    return () => {
      clearTimeout(initialCheckTimeout);
      clearInterval(interval);
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
}