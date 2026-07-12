/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/client" />

// Injected at build time by vite.define (astro.config.mjs): unique build
// number + short commit hash, e.g. "v182 · 58df4fe".
declare const __BUILD_TAG__: string;
