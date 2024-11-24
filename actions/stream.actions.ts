'use server';

import { StreamClient } from '@stream-io/node-sdk';
import { getCookie } from 'cookies-next'; // To parse cookies on the server side
import { cookies } from 'next/headers';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  // Parse cookies from the request headers
  const userPrincipal = getCookie('userPrincipal', { cookies }); // Assuming the user principal is stored in a cookie called `userPrincipal`

  if (!userPrincipal) {
    throw new Error('User principal is missing in cookies');
  }

  console.log(userPrincipal);

  if (!STREAM_API_KEY) throw new Error('Stream API key secret is missing');
  if (!STREAM_API_SECRET) throw new Error('Stream API secret is missing');

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  // Set expiration time for token (1 hour from now)
  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  // Create the Stream token using the user principal from the cookie
  const token = streamClient.createToken(
    userPrincipal.toString(),
    expirationTime,
    issuedAt,
  );

  return token;
};
