/**
 * A/B copy test. Visitors who arrive with ?v=b see version B of the sales texts
 * (no scarcity counters, no simulated buyers, verified numbers). Everyone else sees version A.
 * The choice is kept for the whole visit, so hash navigation inside the quiz doesn't lose it.
 */
const STORAGE_KEY = 'pgb_copy_variant';

const resolveVariant = () => {
  if (typeof window === 'undefined') return 'a';
  const fromUrl = new URLSearchParams(window.location.search).get('v');
  try {
    if (fromUrl === 'a' || fromUrl === 'b') {
      sessionStorage.setItem(STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    return sessionStorage.getItem(STORAGE_KEY) === 'b' ? 'b' : 'a';
  } catch {
    return fromUrl === 'b' ? 'b' : 'a';
  }
};

export const COPY_VARIANT = resolveVariant();
export const IS_VARIANT_B = COPY_VARIANT === 'b';

/** Picks the text for the current version: copy(textA, textB). */
export const copy = (textA, textB) => (IS_VARIANT_B ? textB : textA);
