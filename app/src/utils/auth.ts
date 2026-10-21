// Client for the purchase-verified session served by /api (see api/login.js)

export interface ServerSession {
  email: string;
  name?: string;
  hasUpsell: boolean;
}

export type LoginResult =
  | { ok: true; session: ServerSession }
  | { ok: false; reason: 'not_found' | 'invalid' | 'unavailable' };

export async function fetchSession(): Promise<ServerSession | null> {
  try {
    const res = await fetch('/api/session', { credentials: 'same-origin' });
    if (!res.ok) return null;
    return (await res.json()) as ServerSession;
  } catch {
    return null;
  }
}

export async function login(email: string): Promise<LoginResult> {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) return { ok: true, session: (await res.json()) as ServerSession };
    if (res.status === 403) return { ok: false, reason: 'not_found' };
    if (res.status === 400) return { ok: false, reason: 'invalid' };
    return { ok: false, reason: 'unavailable' };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
  } catch {
    // ignore: the cookie expires on its own
  }
}

// Public (non-secret) checkout link for buying the Acelerador from inside the app
export const UPSELL_CHECKOUT_URL: string =
  import.meta.env.VITE_UPSELL_CHECKOUT_URL || 'https://pay.hotmart.com/I108133663X';
