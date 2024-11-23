// context/AuthProvider.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import {
  initAuth,
  login,
  logout,
  isAuthenticated,
  getPrincipalFromLocalStorage,
} from '@/actions/auth.actions';

interface AuthContextType {
  authClient: AuthClient | null;
  principal: string | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const setupAuth = async () => {
      const client = await initAuth();
      setAuthClient(client);

      const storedPrincipal = getPrincipalFromLocalStorage();
      if (storedPrincipal) {
        setPrincipal(storedPrincipal);
        setAuthenticated(true);
      } else if (await isAuthenticated(client)) {
        const identity = client.getIdentity();
        const fetchedPrincipal = identity?.getPrincipal().toString() || null;
        setPrincipal(fetchedPrincipal);
        setAuthenticated(true);
      }
    };
    setupAuth();
  }, []);

  const handleLogin = async () => {
    if (authClient) {
      await login(authClient, (loggedPrincipal) => {
        setPrincipal(loggedPrincipal);
        setAuthenticated(true);
      });
    }
  };

  const handleLogout = async () => {
    if (authClient) {
      await logout(authClient);
      setPrincipal(null);
      setAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authClient,
        principal,
        isAuthenticated: authenticated,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
