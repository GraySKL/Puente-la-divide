# Puente / Bridge — Claude project context

A bilingual Spanish/English PWA that teaches:
- **Spanish-first immigrants** the English they need to assert their rights during ICE encounters.
- **English-first US allies** the Spanish they need to support those communities and mutual-aid orgs (Siembra NC and similar).

## MVP scope (DO NOT EXPAND WITHOUT EXPLICIT REQUEST)

The MVP is **Know-Your-Rights scripts only**, in both directions (ES↔EN):
- ~5 ICE-encounter scenario walkthroughs (home, street, workplace, traffic stop, post-detention).
- ~25-phrase core deck drawn from ILRC red cards.
- A simple flashcard practice mode.

**Explicitly NOT in MVP** (later phases — do not build until asked):
- Trusted-help / mutual-aid org directory
- Structured language lessons beyond the rights phrases
- Panic-button or trusted-contact alert (Notifica replacement)
- Native iOS / Android wrappers
- Accounts, login, sync, server-side anything

If a change request would expand beyond MVP, stop and confirm with the user first.

## Threat model (non-negotiable)

Users of this app are vulnerable to immigration enforcement. Per recent reporting (2025–2026):
- DHS is actively subpoenaing tech companies for user data tied to ICE-critical activity.
- Google handed user location data to ICE in April 2026.
- ICEBlock was pulled from both app stores in Oct 2025 under DOJ pressure.

**Therefore, in MVP and until explicitly relaxed by the user:**
- No accounts, no email collection, no contact form.
- No third-party analytics. No Google Fonts (self-host). No third-party CDNs that log visitors.
- No location APIs. Do not use Geolocation, IP-geolocation services, or anything similar.
- No telemetry of any kind. Service worker is for offline caching only — it must not call home.
- Distribution: PWA only. No app-store submissions in MVP (ICEBlock precedent).
- All user state (progress, last-viewed phrase) lives in `localStorage`. Nothing leaves the device.
- Source code intended to be MIT-licensed and public for community audit.

If you are about to add a dependency, network call, script tag, or feature that touches any of the above, **stop and confirm first**.

## Content sourcing rules

**Do not invent legal content.** All rights statements, scripts, and phrases must trace to one of these allowlisted sources:

- ILRC Red Cards — https://www.ilrc.org/redcards (primary; explicitly redistribution-friendly, 59 languages)
- NILC Know-Your-Rights card — https://www.nilc.org/resources/know-your-rights-card/
- ACLU Know Your Rights: Immigrants — https://www.aclu.org/know-your-rights/immigrants-rights
- United We Dream KYR — https://unitedwedream.org/resources/know-your-rights/

When you add or change a phrase or scenario, include a source citation in the content file's frontmatter or as a comment. The `content-vet` subagent (`.claude/agents/content-vet.md`) should be invoked to review any user-facing rights-content change.

Every page that displays rights content must include the bilingual disclaimer: "This is general information, not legal advice. For your situation, contact a lawyer." / "Esto es información general, no asesoría legal. Para su situación, consulte a un abogado."

## Stack

- Astro (TypeScript) for static-first PWA shell.
- Tailwind for styling.
- Astro built-in i18n routing (`/es/...` and `/en/...`) — no runtime translation library.
- `vite-plugin-pwa` for service worker and manifest.
- Content as MDX (scenarios) and JSON (phrase deck) under `src/content/`.
- No backend. Hosting target: Cloudflare Pages or Netlify, statically.

## Token-saving conventions

- Route any research that needs >3 web queries to the `Explore` subagent (via the `Agent` tool) — keeps raw search output out of the main context.
- Do not read the full content corpus (`src/content/**`) into the main context. Grep into it instead.
- When citing external KYR sources, link and quote the specific sentence used — do not paste full pages.
- Prefer editing existing files over creating new ones. The MVP is small; the file layout in the plan is the file layout.
