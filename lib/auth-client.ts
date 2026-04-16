export type AuthSession = {
  name: string;
  email: string;
  company: string;
  createdAt: string;
};

const SESSION_KEY = "truesource.auth.session";
const LAST_VISITED_KEY = "truesource.last.visited";
const AUTH_EVENT = "truesource-auth-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getSession() {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function onAuthChange(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
}

export function setLastVisitedPath(path: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(LAST_VISITED_KEY, path);
}

export function getLastVisitedPath() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(LAST_VISITED_KEY);
}
