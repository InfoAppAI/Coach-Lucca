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
  await fetchSales('setup-check@example.com', requireEnv('HOTMART_PRODUCT_ID'));
}

/** Tries the sales query with different parameter sets and reports Hotmart's status for each. */
export async function probeSalesParams() {
  const token = await getAccessToken();
  const base = API_BASE[process.env.HOTMART_ENV === 'sandbox' ? 'sandbox' : 'production'];
  const email = 'setup-check@example.com';
  const productId = requireEnv('HOTMART_PRODUCT_ID');
  const now = Date.now();
  const variants = {
    email_only: { buyer_email: email },
    email_product: { buyer_email: email, product_id: productId },
    email_product_dates_2024: { buyer_email: email, product_id: productId, start_date: String(HISTORY_START), end_date: String(now) },
    email_product_dates_1y: { buyer_email: email, product_id: productId, start_date: String(now - 365 * 864e5), end_date: String(now) },
    email_product_max50: { buyer_email: email, product_id: productId, max_results: '50' },
    product_only: { product_id: productId },
  };
  const results = {};
  for (const [name, params] of Object.entries(variants)) {
    const res = await fetch(`${base}/payments/api/v1/sales/history?${new URLSearchParams(params)}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    results[name] = res.ok ? 'ok' : `${res.status} ${(await res.text()).slice(0, 120)}`;
  }
  return results;
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
    if (!res.ok) {
      const body = (await res.text()).slice(0, 300);
      throw new HotmartUnavailableError(`Hotmart sales request failed (${res.status}): ${body}`);
    }

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
