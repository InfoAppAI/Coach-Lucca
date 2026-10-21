// In-app navigation: tabs and modals live in the URL hash (#entrenar, #receitas...).
// The two entry pages are hidden paths set at build time (see app/vite.config.ts).
export type AppSlug =
  | '/inicio'
  | '/entrenar'
  | '/comidas'
  | '/coach-ai'
  | '/progreso'
  | '/quiz'
  | '/receitas'
  | '/acelerador';

export const UPSELL_PATH = `/${import.meta.env.VITE_UPSELL_SLUG}/`;
export const APP_PATH = `/${import.meta.env.VITE_APP_SLUG}/`;

const PAGE_TITLES: Record<AppSlug, string> = {
  '/inicio': 'Inicio · Coach Glúteos 28D',
  '/entrenar': 'Entrenamiento de Glúteos · Coach Glúteos 28D',
  '/comidas': 'Plan Nutricional · Coach Glúteos 28D',
  '/coach-ai': 'Coach AI 24/7 · Coach Glúteos 28D',
  '/progreso': 'Progreso 28 Días · Coach Glúteos 28D',
  '/quiz': 'Diagnóstico Personalizado · Coach Glúteos 28D',
  '/receitas': '+50 Recetas Proteicas · Coach Glúteos 28D',
  '/acelerador': 'Protocolo Acelerador 3X VIP · Coach Glúteos 28D',
};

export function isUpsellPage(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.replace(/\/?$/, '/');
  return path === UPSELL_PATH;
}

export function getCurrentSlug(): AppSlug {
  if (typeof window === 'undefined') return '/inicio';
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().replace(/\/$/, '');
  const slug = `/${hash}` as AppSlug;
  return hash && slug in PAGE_TITLES ? slug : '/inicio';
}

export function navigateToSlug(slug: AppSlug, replace: boolean = false) {
  if (typeof window === 'undefined') return;
  document.title = PAGE_TITLES[slug];
  const tab = slug.replace(/^\//, '');
  const target = tab === 'inicio' ? APP_PATH : `${APP_PATH}#${tab}`;
  if (replace) {
    window.history.replaceState({ slug }, '', target);
  } else {
    window.history.pushState({ slug }, '', target);
  }
}
