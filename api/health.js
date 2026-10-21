import { checkHotmartToken, checkSalesLookup } from './_lib/hotmart.js';

const REQUIRED = [
  'HOTMART_CLIENT_ID',
  'HOTMART_CLIENT_SECRET',
  'HOTMART_BASIC',
  'HOTMART_PRODUCT_ID',
  'HOTMART_UPSELL_PRODUCT_ID',
  'SESSION_SECRET',
];

// Setup check for preview deployments only: reports which variables exist and whether
// Hotmart accepts the credentials. Never returns any value.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (process.env.VERCEL_ENV === 'production') return res.status(404).json({ error: 'not_found' });

  const variables = Object.fromEntries(REQUIRED.map((name) => [name, Boolean(process.env[name])]));
  if ((process.env.SESSION_SECRET || '').length < 32) variables.SESSION_SECRET = false;

  let hotmart;
  try {
    await checkHotmartToken();
    hotmart = 'ok';
  } catch (error) {
    hotmart = error.message;
  }

  let sales = 'skipped';
  if (hotmart === 'ok') {
    try {
      await checkSalesLookup();
      sales = 'ok';
    } catch (error) {
      sales = error.message;
    }
  }

  return res.status(200).json({ variables, hotmart, sales });
}
