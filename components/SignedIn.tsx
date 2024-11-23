// components/SignedIn.tsx
'use client';
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';

interface SignedInProps {
  children: React.ReactNode;
}

const SignedIn: React.FC<SignedInProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default SignedIn;
