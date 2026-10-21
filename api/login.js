import { HotmartUnavailableError, verifyPurchase } from './_lib/hotmart.js';
import { createSessionCookie, normalizeEmail, publicSession } from './_lib/session.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const email = normalizeEmail(req.body?.email);
  if (!email) return res.status(400).json({ error: 'invalid_email' });

  try {
    const purchase = await verifyPurchase(email);
    if (!purchase) return res.status(403).json({ error: 'purchase_not_found' });

    const session = { email, name: purchase.name, hasUpsell: purchase.hasUpsell };
    res.setHeader('Set-Cookie', createSessionCookie(session));
    return res.status(200).json(publicSession(session));
  } catch (error) {
    console.error('login failed:', error.message);
    const status = error instanceof HotmartUnavailableError ? 503 : 500;
    // Preview deployments explain the failure (variable names / HTTP status only, never values)
    const detail = process.env.VERCEL_ENV === 'production' ? undefined : error.message;
    return res.status(status).json({ error: 'verification_unavailable', detail });
  }
}
