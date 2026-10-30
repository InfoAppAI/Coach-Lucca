/**
 * Approximate price the buyer will see in Hotmart's checkout, in her own currency.
 * In Latin America "$" means pesos, so "$ 9,90" alone surprises the buyer when the
 * checkout shows MX$ 225 or COP 33.100. Values come from real Hotmart charges (Oct/2026).
 */
const PRICES = {
  MX: { main: 'MX$ 225', downsell: 'MX$ 134' },
  CO: { main: 'COP 33.100', downsell: 'COP 19.700' },
  AR: { main: 'ARS 17.900', downsell: 'ARS 10.700' },
  CL: { main: 'CLP 12.200', downsell: 'CLP 7.300' },
  PE: { main: 'S/ 37', downsell: 'S/ 22' },
  CR: { main: '₡ 4.750', downsell: '₡ 2.830' },
  UY: { main: 'UYU 420', downsell: 'UYU 250' },
  DO: { main: 'RD$ 644', downsell: 'RD$ 384' },
  ES: { main: '10 €', downsell: '6 €' },
};

const ZONES = {
  'America/Bogota': 'CO',
  'America/Santiago': 'CL',
  'America/Punta_Arenas': 'CL',
  'America/Lima': 'PE',
  'America/Costa_Rica': 'CR',
  'America/Montevideo': 'UY',
  'America/Santo_Domingo': 'DO',
  'Europe/Madrid': 'ES',
  'Atlantic/Canary': 'ES',
  'Africa/Ceuta': 'ES',
};

const MEXICO_ZONES = [
  'Mexico_City', 'Cancun', 'Merida', 'Monterrey', 'Matamoros', 'Chihuahua', 'Ciudad_Juarez',
  'Ojinaga', 'Mazatlan', 'Bahia_Banderas', 'Hermosillo', 'Tijuana',
];

function countryFromTimeZone() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (zone.startsWith('America/Argentina/') || zone === 'America/Buenos_Aires') return 'AR';
    if (MEXICO_ZONES.some((city) => zone === `America/${city}`)) return 'MX';
    return ZONES[zone] || null;
  } catch {
    return null;
  }
}

/** e.g. "MX$ 225", or null when the country is unknown or already pays in dollars. */
export function localPrice(offer = 'main') {
  const country = countryFromTimeZone();
  return country ? PRICES[country][offer] : null;
}
