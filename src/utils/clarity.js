/**
 * Microsoft Clarity helpers (the tag itself loads in index.html).
 * Each quiz screen is sent as an event and a tag, so recordings can be filtered by where people stopped.
 */
const call = (...args) => {
  try {
    if (typeof window !== 'undefined' && typeof window.clarity === 'function') window.clarity(...args);
  } catch {
    // Analytics must never break the quiz
  }
};

export const clarityStep = (slug) => {
  call('event', slug);
  call('set', 'etapa', slug);
};

export const clarityEvent = (name) => call('event', name);
