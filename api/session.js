import { HotmartUnavailableError, verifyPurchase } from './_lib/hotmart.js';
import {
  RECHECK_AFTER_MS,
  clearSessionCookie,
  createSessionCookie,
  readSession,
} from './_lib/session.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const session = readSession(req);
  if (!session) return res.status(401).json({ error: 'not_logged_in' });

  if (Date.now() - session.checkedAt < RECHECK_AFTER_MS) {
    return res.status(200).json({ email: session.email, name: session.name, hasUpsell: session.hasUpsell });
  }

  try {
    const purchase = await verifyPurchase(session.email);
    if (!purchase) {
      // Refunded or charged back since the last check
      res.setHeader('Set-Cookie', clearSessionCookie());
      return res.status(401).json({ error: 'purchase_not_found' });
    }
    const refreshed = { email: session.email, name: purchase.name, hasUpsell: purchase.hasUpsell };
    res.setHeader('Set-Cookie', createSessionCookie(refreshed));
    return res.status(200).json(refreshed);
  } catch (error) {
    if (!(error instanceof HotmartUnavailableError)) throw error;
    // Hotmart is down: keep the student in, the next request re-checks
    console.error('session recheck failed:', error.message);
    return res.status(200).json({ email: session.email, name: session.name, hasUpsell: session.hasUpsell });
  }
}
