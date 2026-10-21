// Hotmart API client: OAuth client-credentials token + sales history lookup by buyer email.
// Credentials come only from Vercel environment variables (see .env.example).

const TOKEN_URL = 'https://api-sec-vlc.hotmart.com/security/oauth/token';
const API_BASE = {
  production: 'https://developers.hotmart.com',
  sandbox: 'https://sandbox.hotmart.com',
};
const PAID_STATUSES = new Set(['APPROVED', 'COMPLETE']);
// Sales history only returns the last 30 days unless a start date is given
const HISTORY_START = Date.UTC(2024, 0, 1);

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
  if (!res.ok) throw new HotmartUnavailableError(`Hotmart token request failed (${res.status})`);

  const data = await res.json();
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

async function fetchSales(email, productId) {
  const token = await getAccessToken();
  const base = API_BASE[process.env.HOTMART_ENV === 'sandbox' ? 'sandbox' : 'production'];
  const items = [];
  let pageToken = '';

  do {
    const params = new URLSearchParams({
      buyer_email: email,
      product_id: productId,
      start_date: String(HISTORY_START),
      end_date: String(Date.now()),
      max_results: '50',
    });
    if (pageToken) params.set('page_token', pageToken);

    const res = await fetch(`${base}/payments/api/v1/sales/history?${params}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (res.status === 401) cachedToken = null;
    if (!res.ok) throw new HotmartUnavailableError(`Hotmart sales request failed (${res.status})`);

    const data = await res.json();
    items.push(...(data.items || []));
    pageToken = data.page_info?.next_page_token || '';
  } while (pageToken);

  return items;
}

function findPaidSale(items, email) {
  return items.find(
    (item) =>
      PAID_STATUSES.has(item.purchase?.status) &&
      (item.buyer?.email || '').trim().toLowerCase() === email
  );
}

/**
 * Returns { name, hasUpsell } when the email has a paid purchase of the main product,
 * or null when it has none. Throws HotmartUnavailableError when Hotmart can't be reached.
 */
export async function verifyPurchase(email) {
  const mainSale = findPaidSale(await fetchSales(email, requireEnv('HOTMART_PRODUCT_ID')), email);
  if (!mainSale) return null;

  const upsellId = process.env.HOTMART_UPSELL_PRODUCT_ID;
  const upsellSale = upsellId ? findPaidSale(await fetchSales(email, upsellId), email) : null;

  return { name: mainSale.buyer?.name || '', hasUpsell: Boolean(upsellSale) };
}
