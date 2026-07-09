// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

// Base-path readiness: GitHub Pages serves this under /Puente-la-divide/, a
// Capacitor shell serves it from /. Set ASTRO_BASE at build time to switch.
const BASE = process.env.ASTRO_BASE || '/';
// Used below to build a base-aware workbox fallback path (independent of how
// Astro itself normalizes `base`) — always ends in exactly one trailing slash.
const BASE_WITH_SLASH = BASE.endsWith('/') ? BASE : `${BASE}/`;

// https://astro.build/config
export default defineConfig({
  site: 'https://grayskl.github.io',
  base: BASE,
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false }
  },
  integrations: [
    mdx(),
    // Powers the Puente la Divide interactive app island (src/app/**) only —
    // jsx compilation is scoped there so it never touches the .astro pages.
    // .tsx only: a bare src/app/**/* would also route .json imports (e.g.
    // audio-manifest.json) through the JSX compiler and break the build.
    preact({ include: ['src/app/**/*.tsx'] }),
    AstroPWA({
      registerType: 'autoUpdate',
      // Service worker is for OFFLINE CACHING ONLY. Do not add anything that calls home.
      workbox: {
        // mp3 = pre-generated Spanish phrase audio (public/audio/es/*.mp3),
        // precached so the app speaks with zero network calls once installed.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff,woff2,json,mdx,mp3}'],
        navigateFallback: `${BASE_WITH_SLASH}offline`,
        cleanupOutdatedCaches: true
      },
      manifest: false, // we ship a hand-written manifest in /public
      injectRegister: 'auto'
    })
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Allow access from droplet hostname/IP during dev
      host: true
    }
  }
});
