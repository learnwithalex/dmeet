import { AuthClient } from "@dfinity/auth-client";

// Key to store principal in localStorage
const LOCAL_STORAGE_KEY = "icp_principal";

export const initAuth = async (): Promise<AuthClient> => {
  const authClient = await AuthClient.create();
  return authClient;
};

export const login = async (
  authClient: AuthClient,
  onSuccess: (principal: string) => void,
  onError?: (err: unknown) => void
): Promise<void> => {
  try {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        const identity = await getIdentity(authClient);
        const principal = identity?.getPrincipal().toString();
        if (principal) {
          savePrincipalToLocalStorage(principal);
          onSuccess(principal);
        }
      },
      onError: (err) => {
        console.error("Login failed:", err);
        if (onError) onError(err);
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    if (onError) onError(err);
  }
};

export const logout = async (authClient: AuthClient): Promise<void> => {
  await authClient.logout();
  clearPrincipalFromLocalStorage();
  console.log("Logged out");
};

export const isAuthenticated = async (authClient: AuthClient): Promise<boolean> => {
  return await authClient.isAuthenticated();
};

export const getIdentity = async (authClient: AuthClient) => {
  if (await authClient.isAuthenticated()) {
    return authClient.getIdentity();
  }
  return null;
};

// Utility: Save Principal to Local Storage
export const savePrincipalToLocalStorage = (principal: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, principal);
};

// Utility: Retrieve Principal from Local Storage
export const getPrincipalFromLocalStorage = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
};

// Utility: Clear Principal from Local Storage
export const clearPrincipalFromLocalStorage = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
