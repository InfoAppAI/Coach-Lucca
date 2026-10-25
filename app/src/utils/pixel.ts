/**
 * Meta Pixel for the upsell page only. It loads on demand, so the members app stays untracked.
 * Custom events (not ViewContent/Purchase) keep the ad campaigns' optimization untouched.
 */
const PIXEL_ID = '1082586257473844';

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let ready = false;

function ensurePixel() {
  if (ready || typeof window === 'undefined') return;
  ready = true;
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
}

function trackCustom(event: string, params: Record<string, unknown>) {
  try {
    ensurePixel();
    window.fbq?.('trackCustom', event, params);
  } catch {
    // Tracking must never break the offer page
  }
}

/** Where the visitor came from: "pay.hotmart.com" means a real buyer sent by the funnel. */
function referrerHost() {
  try {
    return document.referrer ? new URL(document.referrer).hostname : 'direct';
  } catch {
    return 'unknown';
  }
}

export const trackUpsellView = (offer: 'upsell' | 'downsell', value: number) =>
  trackCustom('UpsellView', { offer, value, currency: 'USD', referrer: referrerHost() });

export const trackUpsellCtaClick = (offer: 'upsell' | 'downsell', value: number) =>
  trackCustom('UpsellCTAClick', { offer, value, currency: 'USD' });

export const trackUpsellDecline = (offer: 'upsell' | 'downsell') => trackCustom('UpsellDecline', { offer });
