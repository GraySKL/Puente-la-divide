# Puente / Bridge

A bilingual Spanish/English Progressive Web App teaching:

- **Spanish-first immigrants** the English they need to assert their rights during ICE encounters.
- **English-first US allies** the Spanish they need to support those communities and mutual-aid orgs.

MVP scope is intentionally tight: 5 scenario walkthroughs and a ~25-phrase practice deck, both directions.

## Why

No app currently combines bilingual ICE-encounter scripting with ally Spanish learning. Notifica was discontinued Feb 2025. ICEBlock was pulled from both app stores in Oct 2025 under DOJ pressure. The gap is real and the privacy stakes are unusually high.

## Privacy posture

Users of this app are vulnerable to immigration enforcement. The MVP ships with:

- No accounts, no email, no contact form.
- No third-party analytics. No Google Fonts. No third-party CDNs.
- No location APIs of any kind.
- All user state in `localStorage` — nothing leaves the device.
- Service worker is for offline caching only — it does not call home.
- Distribution: PWA only, no app stores.

If you're contributing, the threat model in [CLAUDE.md](CLAUDE.md) is non-negotiable for the MVP.

## Content sources

All rights statements trace to one of:

- [ILRC Red Cards](https://www.ilrc.org/redcards) — primary, redistribution-friendly, 59 languages.
- [NILC Know-Your-Rights card](https://www.nilc.org/resources/know-your-rights-card/)
- [ACLU Know Your Rights: Immigrants](https://www.aclu.org/know-your-rights/immigrants-rights)
- [United We Dream KYR](https://unitedwedream.org/resources/know-your-rights/)

## Development

```bash
npm install
npm run dev         # Astro dev server on :4321
npm run build       # Static build to dist/
npm run preview     # Preview the production build
npm run check       # TypeScript + Astro check
```

Requires Node 20+ (the Astro 5 minimum).

### Project layout

```
src/
├── content/
│   ├── scenarios/{en,es}/*.mdx     # 5 scenarios x 2 languages
│   └── phrases/core-rights.json    # phrase deck
├── pages/
│   ├── index.astro                 # language picker
│   ├── en/...                      # English-first UI
│   └── es/...                      # Spanish-first UI
├── components/
├── layouts/
├── i18n/strings.ts
└── styles/globals.css
```

## License

MIT — see [LICENSE](LICENSE). Source intentionally public for community audit.

## Disclaimer

This is general information, not legal advice. For your situation, contact a lawyer.

Esto es información general, no asesoría legal. Para su situación, consulte a un abogado.
