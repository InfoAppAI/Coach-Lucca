/**
 * A/B test of the first screen.
 * A = welcome page with button (current); B = the visitor lands straight on quiz question 1.
 * The variant sticks per browser, can be forced with ?v=a or ?v=b, and is tagged in Clarity
 * ("variante_inicio") so the funnel can be compared by variant.
 */
import { clarityTag } from './clarity';

const STORAGE_KEY = 'pgb_ab_inicio';
const VARIANTS = ['a', 'b'];

export const getWelcomeVariant = () => {
  if (typeof window === 'undefined') return 'a';
  let variant = null;
  try {
    const forced = new URLSearchParams(window.location.search).get('v');
    if (VARIANTS.includes(forced)) variant = forced;
  } catch {
    // Ignore malformed URLs
  }
  try {
    if (!variant) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (VARIANTS.includes(saved)) variant = saved;
    }
    if (!variant) variant = Math.random() < 0.5 ? 'a' : 'b';
    localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    if (!variant) variant = Math.random() < 0.5 ? 'a' : 'b';
  }
  clarityTag('variante_inicio', variant);
  return variant;
};
