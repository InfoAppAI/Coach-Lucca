/**
 * Microsoft Clarity for the upsell page only, loaded on demand like the Pixel,
 * so the members' app is never recorded.
 */
const CLARITY_ID = 'z97dw35r7j';

type Clarity = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: Clarity;
  }
}

let loaded = false;

function ensureClarity() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  if (!window.clarity) {
    const clarity = function (...args: unknown[]) {
      (clarity.q = clarity.q || []).push(args);
    } as Clarity;
    window.clarity = clarity;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    document.head.appendChild(script);
  }
}

/** Starts recording and names the session's step ("upsell" or "downsell"). */
export function clarityUpsell(offer: 'upsell' | 'downsell') {
  try {
    ensureClarity();
    window.clarity?.('set', 'etapa', offer);
    window.clarity?.('event', `${offer}_view`);
  } catch {
    // Analytics must never break the offer page
  }
}
