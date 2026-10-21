import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Hidden entry paths. They must match the rewrites in ../vercel.json.
const UPSELL_SLUG = 'vip-ukyvpucxeh';
const APP_SLUG = 'area-4yvj848l4g';

export default defineConfig({
  // Assets live under a neutral folder so neither hidden path appears in asset URLs
  base: '/_m/',
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_UPSELL_SLUG': JSON.stringify(UPSELL_SLUG),
    'import.meta.env.VITE_APP_SLUG': JSON.stringify(APP_SLUG),
  },
  // Exercises and sounds are served from the quiz's public/ folder at the site root
  publicDir: false,
  build: {
    outDir: '../dist/_m',
    emptyOutDir: true,
  },
  server: {
    // Local dev: run `vercel dev` at the repo root for /api, or proxy to it here
    proxy: { '/api': 'http://localhost:3000' },
  },
});
