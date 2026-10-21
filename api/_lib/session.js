// Signed session cookie (HMAC-SHA256). The browser can read nothing and change nothing:
// any edit to the payload breaks the signature.
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'cl_session';
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
// Purchases are re-checked with Hotmart after this, so refunds and chargebacks lose access
export const RECHECK_AFTER_MS = 24 * 60 * 60 * 1000;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('SESSION_SECRET must be set (32+ characters)');
  return value;
}

function sign(data) {
  return createHmac('sha256', secret()).update(data).digest('base64url');
}

export function createSessionCookie({ email, name, hasUpsell }) {
  const payload = Buffer.from(
    JSON.stringify({ email, name, hasUpsell, checkedAt: Date.now() })
  ).toString('base64url');
  const value = `${payload}.${sign(payload)}`;
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

/** Returns the session payload, or null when the cookie is missing, expired or tampered with. */
export function readSession(req) {
  const header = req.headers.cookie || '';
  const raw = header
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return null;

  const [payload, signature] = raw.slice(COOKIE_NAME.length + 1).split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (Date.now() - session.checkedAt > MAX_AGE_SECONDS * 1000) return null;
    return session;
  } catch {
    return null;
  }
}

export function normalizeEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 ? email : null;
}
