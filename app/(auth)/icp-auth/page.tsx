'use client';
import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next'; // To handle cookies in Next.js

import {
  initAuth,
  login,
  logout,
  isAuthenticated,
  getIdentity,
  getPrincipalFromLocalStorage,
} from '@/actions/auth.actions';

const ICPAuth = () => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const setupAuth = async () => {
      const client = await initAuth();
      setAuthClient(client);

      // Check if there's a stored principal in localStorage
      const storedPrincipal = getPrincipalFromLocalStorage();
      if (storedPrincipal) {
        setPrincipal(storedPrincipal);
      } else if (await isAuthenticated(client)) {
        const identity = await getIdentity(client);
        const fetchedPrincipal = identity?.getPrincipal().toString() || null;
        setPrincipal(fetchedPrincipal);
      }
    };
    setupAuth();
  }, []);

  const handleLogin = async () => {
    if (authClient) {
      await login(authClient, (loggedPrincipal) => {
        setPrincipal(loggedPrincipal);

        // Set the ICP principal in a cookie for server-side access
        setCookie('userPrincipal', loggedPrincipal); // Expires in 30 days

        router.push('/');
      });
    }
  };

  const handleLogout = async () => {
    if (authClient) {
      await logout(authClient);
      setPrincipal(null);

      // Remove the userPrincipal cookie on logout
      setCookie('userPrincipal', ''); // Cookie will be deleted
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">
          <div className="flex items-center gap-1">
            <img src="/icons/logo.svg" width={32} height={32} alt="yoom logo" />
            <p className="text-[26px] font-extrabold text-white">Dmeet</p>
          </div>
        </h1>
        <p className="text-sm text-white mb-5">
          Decentralized meetings for everyone
        </p>
        {principal ? (
          <>
            <p className="text">
              <b>ICP Principal</b>: {principal}
            </p>
            <button className="button logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="button login" onClick={handleLogin}>
            Sign in with ICP Identity
          </button>
        )}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .card {
          background-color: #645d57;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }
        .title {
          color: white;
          font-size: 1.5rem;
          margin-bottom: 3px;
          display: flex;
          justify-content: center;
        }
        .text {
          color: white;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }
        .button {
          background-color: #463524;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.8rem 1.2rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }
        .button:hover {
          background-color: white;
          color: #463524;
        }
        .login {
          background-color: #463524;
        }
        .logout {
          background-color: #463524;
        }
      `}</style>
    </div>
  );
};

export default ICPAuth;
