// Hotmart webhook (postback 2.0) → email lists.
// Abandoned checkout of the main product joins the recovery list; an approved purchase leaves it
// and joins the clients list (and the Acelerador list for the upsell). The email tool's own
// automations send the messages, so this endpoint never emails anyone itself.
import { timingSafeEqual } from 'node:crypto';
import { addToList, removeFromList } from './_lib/email.js';

const PAID_EVENTS = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']);
const ABANDON_EVENT = 'PURCHASE_OUT_OF_SHOPPING_CART';

function sameSecret(received, expected) {
  const a = Buffer.from(String(received || ''));
  const b = Buffer.from(String(expected || ''));
  return a.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

function normalizeEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function firstName(name) {
  const first = String(name || '').trim().split(/\s+/)[0] || '';
  return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
}

/** Decides which list changes an event causes. Exported for tests. */
export function planActions(body, env = process.env) {
  const event = body?.event;
  const data = body?.data || {};
  const productId = String(data.product?.id ?? '');
  const email = normalizeEmail(data.buyer?.email);
  if (!event || !email) return { email: null, actions: [] };

  const contact = {
    email,
    firstName: firstName(data.buyer?.first_name || data.buyer?.name),
    country: data.checkout_country?.iso || data.buyer?.address?.country_iso || '',
  };
  const isMain = productId === String(env.HOTMART_PRODUCT_ID || '');
  const isUpsell = productId === String(env.HOTMART_UPSELL_PRODUCT_ID || '');
  const actions = [];

  if (event === ABANDON_EVENT && isMain) {
    actions.push(['add', 'EMAIL_LIST_ABANDONO', contact]);
  } else if (PAID_EVENTS.has(event) && isMain) {
    actions.push(['remove', 'EMAIL_LIST_ABANDONO', email]);
    actions.push(['add', 'EMAIL_LIST_CLIENTES', contact]);
  } else if (PAID_EVENTS.has(event) && isUpsell) {
    actions.push(['add', 'EMAIL_LIST_ACELERADOR', contact]);
  }
  return { email, actions };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const expected = process.env.HOTMART_HOTTOK;
  const received = req.headers['x-hotmart-hottok'] || req.body?.hottok;
  if (!expected || !sameSecret(received, expected)) return res.status(401).json({ error: 'unauthorized' });

  const event = req.body?.event || 'unknown';
  const { actions } = planActions(req.body);
  if (actions.length === 0) return res.status(200).json({ ok: true, event, ignored: true });

  const results = [];
  try {
    for (const [kind, list, arg] of actions) {
      results.push(`${list}:${kind === 'add' ? await addToList(list, arg) : await removeFromList(list, arg)}`);
    }
  } catch (error) {
    // Logged without the buyer's email; a 500 makes Hotmart retry the delivery later
    console.error(`webhook ${event} failed:`, error.message);
    return res.status(500).json({ error: 'email_tool_unavailable' });
  }
  console.log(`webhook ${event}: ${results.join(', ')}`);
  return res.status(200).json({ ok: true, event, results });
}
