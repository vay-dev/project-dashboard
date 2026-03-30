const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = (rawApiUrl && rawApiUrl.length > 0
  ? rawApiUrl
  : "http://localhost:5000"
).replace(/\/+$/, "");

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
