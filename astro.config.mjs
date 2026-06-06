// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://puente.example.org', // update once domain is set
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false }
  },
  integrations: [
    mdx(),
    AstroPWA({
      registerType: 'autoUpdate',
      // Service worker is for OFFLINE CACHING ONLY. Do not add anything that calls home.
      workbox: {
        // mp3 = pre-generated Spanish phrase audio (public/audio/es/*.mp3),
        // precached so the app speaks with zero network calls once installed.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,json,mdx,mp3}'],
        navigateFallback: '/offline',
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
