export const AUTH_KEY = "auth";

export function saveAuthToStorage(data: { isAuthenticated: boolean; email: string }) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function loadAuthFromStorage() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as { isAuthenticated: boolean; email: string };
  } catch {
    return null;
  }
}

export function clearAuthStorage() {
  localStorage.removeItem(AUTH_KEY);
}

export const isBrowser = typeof window !== "undefined";
