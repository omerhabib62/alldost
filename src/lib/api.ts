// Client for the fitness web app's API routes (/api/*).
// Native keeps its Supabase session in AsyncStorage, not cookies, so every
// call authenticates with `Authorization: Bearer <access_token>`.

import { supabase } from '@/lib/supabase';

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`API ${status}`);
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('Missing EXPO_PUBLIC_API_BASE_URL. Check .env at project root.');
  }

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new ApiError(401, { error: 'No session' });

  const res = await fetch(`${apiBaseUrl.replace(/\/$/, '')}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

// Phase 0 integration probe: one authenticated POST /api/log from the device.
// Runs only when EXPO_PUBLIC_API_PROBE=1. Logs the request with the token
// redacted, and the response.
export async function runApiLogProbe() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const url = `${apiBaseUrl?.replace(/\/$/, '')}/api/log`;
  const body = { message: 'what is the capital of France' };

  console.log('[api-probe] request', JSON.stringify({
    method: 'POST',
    url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer <redacted, ${token.length} chars>` : '(none)',
    },
    body,
  }));

  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log('[api-probe] response', JSON.stringify({
      status: res.status,
      ms: Date.now() - started,
      contentType: res.headers.get('content-type'),
      body: text.slice(0, 2000),
    }));
  } catch (e) {
    console.log('[api-probe] network error', String(e));
  }
}
