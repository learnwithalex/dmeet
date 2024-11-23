// components/UserButton.tsx
'use client';
import React from 'react';
import gravatarUrl from 'gravatar-url';
import { useAuth } from '@/providers/AuthProvider';

interface UserButtonProps {
  afterSignOutUrl: string;
}

const UserButton: React.FC<UserButtonProps> = ({ afterSignOutUrl }) => {
  const { principal, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    window.location.href = afterSignOutUrl;
  };

  // Generate Gravatar URL or use a fallback if no principal
  const avatarUrl = principal
    ? gravatarUrl(principal, { size: 80, default: 'retro' })
    : 'https://via.placeholder.com/80';

  return (
    <div className="flex items-center gap-4">
      <img
        src={avatarUrl}
        alt="User Avatar"
        className="w-10 h-10 rounded-full border border-white"
      />
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-all"
      >
        Sign Out
      </button>
    </div>
  );
};

export default UserButton;
