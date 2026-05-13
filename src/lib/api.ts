const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = (rawApiUrl && rawApiUrl.length > 0
  ? rawApiUrl
  : "http://localhost:5000"
).replace(/\/+$/, "");

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const TOKEN_KEY = "vay_admin_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Set by AuthContext so the interceptor can trigger logout from outside React
let onForceLogout: (() => void) | null = null;
export function setForceLogout(fn: () => void) {
  onForceLogout = fn;
}

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

async function attemptRefresh(): Promise<string | null> {
  const token = tokenStore.get();
  if (!token) return null;
  try {
    const res = await fetch(apiUrl("/api/auth/refresh"), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const newToken: string = data.data?.token;
    if (!newToken) return null;
    tokenStore.set(newToken);
    return newToken;
  } catch {
    return null;
  }
}

/**
 * Authenticated fetch wrapper with automatic 401 → refresh → retry.
 * Use this instead of raw fetch for all protected API calls.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const buildHeaders = (t: string | null): HeadersInit => ({
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  });

  const doFetch = (t: string | null) =>
    fetch(apiUrl(path), { ...options, headers: buildHeaders(t) });

  const res = await doFetch(tokenStore.get());
  if (res.status !== 401) return res;

  // Queue concurrent 401s behind a single refresh
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push((newToken) => resolve(doFetch(newToken)));
    });
  }

  isRefreshing = true;
  const newToken = await attemptRefresh();
  isRefreshing = false;

  // Flush queue
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];

  if (newToken) return doFetch(newToken);

  // Refresh failed — clear token and force logout
  tokenStore.clear();
  onForceLogout?.();
  return res;
}
