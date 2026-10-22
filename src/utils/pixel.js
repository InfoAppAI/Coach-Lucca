/**
 * Meta Pixel funnel events + UTM passthrough to the Hotmart checkout.
 * The Pixel itself is loaded in index.html; Purchase is sent by Hotmart's own Pixel integration.
 */
import { COPY_VARIANT } from './variant';

const UTM_STORAGE_KEY = 'pgb_utms';
const TRACKED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck', 'fbclid'];
const PRICE = { main: 9.9, downsell: 5.9 };
const firedOnce = new Set();

const fbq = (method, event, params = {}) => {
  try {
    // Every funnel event says which copy version (A/B) the visitor saw
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq(method, event, { ...params, copy_variant: COPY_VARIANT });
    }
  } catch {
    // Tracking must never break the funnel
  }
};

const trackOnce = (key, ...args) => {
  if (firedOnce.has(key)) return;
  firedOnce.add(key);
  fbq(...args);
};

/** Saves the ad's UTMs on arrival so they survive the quiz navigation. */
export const captureAndPersistUTMs = () => {
  if (typeof window === 'undefined') return {};
  const fromUrl = {};
  const params = new URLSearchParams(window.location.search);
  TRACKED_PARAMS.forEach((key) => {
    const value = params.get(key);
    if (value) fromUrl[key] = value;
  });
  try {
    if (Object.keys(fromUrl).length) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
  } catch {
    return fromUrl;
  }
};

/** Checkout link carrying the campaign data, so Hotmart reports show which ad sold. */
export const withTracking = (checkoutUrl) => {
  try {
    const url = new URL(checkoutUrl);
    const utms = captureAndPersistUTMs();
    Object.entries(utms).forEach(([key, value]) => {
      if (key !== 'fbclid' && !url.searchParams.has(key)) url.searchParams.set(key, value);
    });
    // Hotmart reports group sales by "sck": tag which copy version sold
    if (!url.searchParams.has('sck')) url.searchParams.set('sck', `var_${COPY_VARIANT}`);
    // Hotmart groups sales by "src": fall back to the campaign source
    if (!url.searchParams.has('src') && utms.utm_source) url.searchParams.set('src', utms.utm_source);
    return url.toString();
  } catch {
    return checkoutUrl;
  }
};

export const trackQuizStart = () => trackOnce('quiz_start', 'trackCustom', 'QuizStart');

/** Quiz completed: the best signal for Meta before the purchase. */
export const trackLead = () =>
  trackOnce('lead', 'track', 'Lead', { content_name: 'Quiz Glúteos Completo', value: PRICE.main, currency: 'USD' });

export const trackVSLPlay = () => trackOnce('vsl_play', 'trackCustom', 'VSLPlay');

export const trackOfferView = (offer = 'main') =>
  trackOnce(`offer_${offer}`, 'track', 'ViewContent', {
    content_name: offer === 'downsell' ? 'Oferta Downsell' : 'Oferta Principal',
    content_ids: [offer === 'downsell' ? 'PGB_DOWNSELL' : 'PGB_MAIN'],
    content_type: 'product',
    value: PRICE[offer],
    currency: 'USD',
  });

export const trackCheckoutClick = (offer = 'main') =>
  fbq('track', 'InitiateCheckout', {
    content_ids: [offer === 'downsell' ? 'PGB_DOWNSELL' : 'PGB_MAIN'],
    content_type: 'product',
    value: PRICE[offer],
    currency: 'USD',
    num_items: 1,
  });
