'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useAuth } from '@/providers/AuthProvider';
import gravatarUrl from 'gravatar-url';
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import * as crypto from 'crypto';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  const { isAuthenticated, principal } = useAuth();

  const generateRandomName = () => {
    return crypto.randomBytes(8).toString('hex'); // Generate a random string
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!API_KEY) throw new Error('Stream API key is missing');

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: principal,
        name: generateRandomName(),
        image: gravatarUrl(principal!, { size: 80, default: 'identicon' }),
      },
      tokenProvider,
    });

    setVideoClient(client);
  }, [isAuthenticated, principal]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;