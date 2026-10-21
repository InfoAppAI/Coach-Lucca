import { UserSession } from '../types';

// Per-device profile data (name, weight, photos, quiz answers).
// Access rights (email, hasUpsell) never come from here: they come from /api/session.
const PROFILE_KEY = 'coach_gluteos_profile';

export function loadLocalProfile(): Partial<UserSession> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Partial<UserSession>) : {};
  } catch {
    return {};
  }
}

export function saveLocalProfile(session: Partial<UserSession>): void {
  if (typeof window === 'undefined') return;
  const { email: _email, hasUpsell: _hasUpsell, isVerified: _isVerified, ...profile } = session;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...loadLocalProfile(), ...profile }));
  } catch {
    // Storage full (large photos) or blocked: the app keeps working for this visit
  }
}

export function clearLocalProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch {
    // ignore
  }
}
