/**
 * Blocks the sales quiz for countries where we don't sell (fraud, chargebacks, payments that fail).
 * Only the quiz is blocked: the upsell, the app and the API stay open so existing buyers keep access.
 * Vercel tells us the visitor's country in the x-vercel-ip-country header.
 */
const BLOCKED_COUNTRIES = new Set([
  'AF', 'DZ', 'AO', 'AM', 'AZ', 'BD', 'BY', 'BJ', 'BT', 'BW', 'BF', 'BI', 'KH', 'CM', 'TD', 'KM',
  'CG', 'CI', 'CU', 'DJ', 'EG', 'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'GQ', 'YE', 'IN', 'ID',
  'IQ', 'IR', 'KZ', 'KE', 'KG', 'LA', 'LB', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MA', 'MZ',
  'MM', 'NA', 'NP', 'NE', 'NG', 'KP', 'PK', 'PS', 'CF', 'CD', 'RW', 'ST', 'SN', 'SL', 'SO', 'LK',
  'SD', 'SS', 'SZ', 'SY', 'TJ', 'TZ', 'TG', 'TN', 'TM', 'UG', 'UZ', 'VN', 'ZM', 'ZW',
]);

const BLOCKED_PAGE = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>No disponible</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#fff5f8;font-family:system-ui,sans-serif;color:#3a2030;text-align:center;padding:24px">
<div><h1 style="font-size:22px;margin:0 0 12px">Lo sentimos 💗</h1>
<p style="margin:0;font-size:16px;line-height:1.5">Este programa aún no está disponible en tu país.</p></div>
</body></html>`;

export const config = { matcher: ['/', '/index.html'] };

export default function middleware(request) {
  let country = request.headers.get('x-vercel-ip-country') || '';
  // Preview deployments accept ?geo=XX so the block can be tested from anywhere
  if (process.env.VERCEL_ENV !== 'production') {
    country = new URL(request.url).searchParams.get('geo') || country;
  }
  if (!BLOCKED_COUNTRIES.has(country.toUpperCase())) return;

  return new Response(BLOCKED_PAGE, {
    status: 403,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}
