/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UPSELL_SLUG: string;
  readonly VITE_APP_SLUG: string;
  readonly VITE_UPSELL_CHECKOUT_URL?: string;
}
