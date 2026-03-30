import { API_ORIGIN } from '../config/env';

export function resolveImageUrl(value) {
  if (!value) return null;

  const str = String(value).trim();
  if (!str) return null;

  // Already absolute (http/https)
  if (/^https?:\/\//i.test(str)) {
    try {
      const u = new URL(str);
      const api = new URL(API_ORIGIN);

      // Fix common misconfig: backend returns http://localhost/storage/... (no port)
      // while API actually runs on http://localhost:8000.
      if (
        (u.hostname === api.hostname || (u.hostname === 'localhost' && api.hostname === 'localhost')) &&
        (!u.port || u.port === '80') &&
        api.port &&
        u.pathname.startsWith('/storage/')
      ) {
        return `${api.origin}${u.pathname}${u.search}${u.hash}`;
      }

      return str;
    } catch {
      return str;
    }
  }

  // Full-path from backend (e.g. /storage/room_types/...)
  if (str.startsWith('/')) return `${API_ORIGIN}${str}`;

  // Stored path in DB (e.g. room_types/xxx.jpg)
  return `${API_ORIGIN}/storage/${str}`;
}

