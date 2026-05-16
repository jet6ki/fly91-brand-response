/**
 * Lightweight API client. Wraps fetch with sane defaults and error handling.
 *
 * Used by every React component that talks to the Express backend.
 * Centralised here so retry/auth/error-toast logic only lives in one place.
 */

const BASE_URL = '/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = data.error || data.message || `HTTP ${res.status}`;
      const details = data.details ? `: ${data.details.join(', ')}` : '';
      throw new ApiError(message + details, res.status, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // Network or parse error
    throw new ApiError(err.message || 'Network error', 0, null);
  }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};

// Helper for admin requests
export function withAuth(token) {
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
}
