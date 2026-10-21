// Hotmart API client: OAuth client-credentials token + sales history lookup by buyer email.
// Credentials come only from Vercel environment variables (see .env.example).

const TOKEN_URL = 'https://api-sec-vlc.hotmart.com/security/oauth/token';
const API_BASE = {
  production: 'https://developers.hotmart.com',
  sandbox: 'https://sandbox.hotmart.com',
};
const PAID_STATUSES = new Set(['APPROVED', 'COMPLETE']);
// Sales history returns only the last 30 days without dates, and rejects ranges longer than
// about a year, so purchases are searched in windows going back to the products' launch year
const HISTORY_START = Date.UTC(2026, 0, 1);
const WINDOW_MS = 360 * 24 * 60 * 60 * 1000;

let cachedToken = null;

export class HotmartUnavailableError extends Error {}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new HotmartUnavailableError(`Missing environment variable ${name}`);
  return value;
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: requireEnv('HOTMART_CLIENT_ID'),
    client_secret: requireEnv('HOTMART_CLIENT_SECRET'),
  });
  const res = await fetch(`${TOKEN_URL}?${params}`, {
    method: 'POST',
    // Accept the value pasted with or without the "Basic " prefix shown by Hotmart
    headers: { Authorization: `Basic ${requireEnv('HOTMART_BASIC').replace(/^Basic\s+/i, '').trim()}` },
  });
  if (!res.ok) {
    const body = (await res.text()).slice(0, 300);
    throw new HotmartUnavailableError(`Hotmart token request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

/** Throws when Hotmart rejects the credentials (used by the preview setup check). */
export async function checkHotmartToken() {
  cachedToken = null;
  await getAccessToken();
}

/** Runs a sales lookup for an address that has no purchases (used by the preview setup check). */
export async function checkSalesLookup() {
  await findPaidSale('setup-check@example.com', requireEnv('HOTMART_PRODUCT_ID'));
}

async function fetchSalesPage(email, productId, startDate, endDate, pageToken) {
  const token = await getAccessToken();
  const base = API_BASE[process.env.HOTMART_ENV === 'sandbox' ? 'sandbox' : 'production'];
  const params = new URLSearchParams({
    buyer_email: email,
    product_id: productId,
    start_date: String(startDate),
    end_date: String(endDate),
    max_results: '50',
  });
  if (pageToken) params.set('page_token', pageToken);

  const res = await fetch(`${base}/payments/api/v1/sales/history?${params}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (res.status === 401) cachedToken = null;
  if (!res.ok) {
    const body = (await res.text()).slice(0, 300);
    throw new HotmartUnavailableError(`Hotmart sales request failed (${res.status}): ${body}`);
  }
  return res.json();
}

/** Most recent paid sale of the product for this buyer, searching newest window first. */
async function findPaidSale(email, productId) {
  for (let end = Date.now(); end > HISTORY_START; end -= WINDOW_MS) {
    const start = Math.max(HISTORY_START, end - WINDOW_MS);
    let pageToken = '';
    do {
      const data = await fetchSalesPage(email, productId, start, end, pageToken);
      const sale = (data.items || []).find(
        (item) =>
          PAID_STATUSES.has(item.purchase?.status) &&
          (item.buyer?.email || '').trim().toLowerCase() === email
      );
      if (sale) return sale;
      pageToken = data.page_info?.next_page_token || '';
    } while (pageToken);
  }
  return null;
}

/**
 * Returns { name, hasUpsell } when the email has a paid purchase of the main product,
 * or null when it has none. Throws HotmartUnavailableError when Hotmart can't be reached.
 */
export async function verifyPurchase(email) {
  const mainSale = await findPaidSale(email, requireEnv('HOTMART_PRODUCT_ID'));
  if (!mainSale) return null;

  const upsellId = process.env.HOTMART_UPSELL_PRODUCT_ID;
  const upsellSale = upsellId ? await findPaidSale(email, upsellId) : null;

  return { name: mainSale.buyer?.name || '', hasUpsell: Boolean(upsellSale) };
}
