// src/app/ui.tsx — Aliento design tokens, on-device TTS, and shared UI atoms.
// Ported from Claude Design/pui.jsx + Claude Design/kit.jsx (Preact + TS).
//
// THREAT MODEL: pui.jsx's live prototype also shipped browser SpeechRecognition
// (speech-to-text) helpers for a "say it out loud" feature. On Chrome that API
// streams microphone audio to Google's servers — a hard violation of this
// project's no-telemetry / no-network threat model (see CLAUDE.md). Those
// helpers (recognizeOnce, speechRecognitionAvailable, phraseSimilarity,
// normalizePhrase) are intentionally NOT ported. See speak.tsx for the
// on-device "listen & repeat" replacement.
import { useState } from 'preact/hooks';
import type { ComponentChildren, JSX } from 'preact';
import { TOPICS, normalizeSpoken, spanishAudioSlug, type TopicKey } from './data';
import audioManifest from './audio-manifest.json';

// Theme tokens resolve to CSS custom properties defined on .pd-app in
// src/pages/app.astro (light defaults + dark overrides via
// prefers-color-scheme and the manual data-theme toggle) — the whole app
// repaints for dark mode via CSS alone, no JS re-render needed.
export const C = {
  bg: 'var(--pd-bg)',
  panel: 'var(--pd-panel)',
  ink: 'var(--pd-ink)',
  dim: 'var(--pd-dim)',
  faint: 'var(--pd-faint)',
  // Fixed dark "ink fill" for solid-dark chips (Pill kind="dark", your-own
  // chat bubble, sidebar CTA) — deliberately does NOT invert in dark mode,
  // see app.astro's --pd-solid comment.
  solid: 'var(--pd-solid)',
  hairline: 'var(--pd-hairline)',
  divider: 'var(--pd-divider)',
  chrome: 'var(--pd-chrome)',
  chromeSoft: 'var(--pd-chrome-soft)',
  round: '"Nunito", system-ui',
  sh: 'var(--pd-shadow)',
  shSoft: 'var(--pd-shadow-soft)',
};

// ---- topic color system (Claude Design/kit.jsx) ----------------------------
// Every hue actually used across data.ts/ui.tsx (parada 250, clinica 155,
// trabajo 75, casa 40, escuela 330, corte 285, PREPARE_HUE 200) has matching
// --t<hue>-* vars on .pd-app in app.astro, light + dark. An unknown hue falls
// back to 250 (parada) instead of emitting a var() that resolves to nothing.
const KNOWN_HUES = [250, 155, 75, 40, 330, 285, 200] as const;
const hueOrFallback = (h: number): number => ((KNOWN_HUES as readonly number[]).includes(h) ? h : 250);
export const topicInk = (h: number) => `var(--t${hueOrFallback(h)}-ink)`; // strong
export const topicMid = (h: number) => `var(--t${hueOrFallback(h)}-mid)`; // vivid
export const topicSoft = (h: number) => `var(--t${hueOrFallback(h)}-soft)`; // wash
export const topicEdge = (h: number) => `var(--t${hueOrFallback(h)}-edge)`; // hairline

// ---- on-device speech synthesis — English + Spanish, never touches the network ----
let _voices: SpeechSynthesisVoice[] = [];
const _voiceCache: Record<string, SpeechSynthesisVoice | null> = {};

function _loadVoices() {
  try {
    _voices = speechSynthesis.getVoices() || [];
  } catch {
    return;
  }
  for (const k in _voiceCache) delete _voiceCache[k];
}
if (typeof window !== 'undefined' && typeof speechSynthesis !== 'undefined') {
  _loadVoices();
  speechSynthesis.onvoiceschanged = _loadVoices;
  // Safari/iOS sometimes reports voices late — poll briefly until they arrive.
  let _tries = 0;
  const _poll = setInterval(() => {
    _loadVoices();
    if (_voices.length || ++_tries > 20) clearInterval(_poll);
  }, 250);
}

// Rank a voice for naturalness. We never hit the network; we just pick the
// best engine already installed on the device, which keeps TTS offline.
function _scoreVoice(v: SpeechSynthesisVoice, lang2: string): number {
  if (!v || !v.lang) return -1;
  const vl = v.lang.toLowerCase().replace('_', '-');
  if (!vl.startsWith(lang2)) return -1;
  const n = (v.name || '').toLowerCase();
  let s = 0;
  if (n.includes('natural')) s += 60;
  if (n.includes('neural')) s += 60;
  if (n.includes('premium') || n.includes('enhanced')) s += 55;
  if (n.includes('online')) s += 30;
  if (n.includes('google')) s += 45;
  if (n.includes('siri')) s += 50;
  if (/(samantha|alex|ava|allison|aaron|evan|jenny|aria|nova|serena|kate|daniel|karen|moira|tessa)/.test(n)) s += 35;
  if (/(m[óo]nica|paulina|juan|jorge|marisol|helena|laura|elvira|sabina|dalia)/.test(n)) s += 35;
  if (lang2 === 'en' && vl === 'en-us') s += 8;
  if (lang2 === 'es' && (vl === 'es-mx' || vl === 'es-us')) s += 10;
  if (lang2 === 'es' && vl === 'es-es') s += 4;
  if (v.localService) s += 5;
  if (/(compact|eloquence|fred|albert|zarvox|trinoids|cellos|bells|bahh|boing|jester|wobble|whisper)/.test(n)) s -= 40;
  return s;
}

function _pickVoice(lang2: string): SpeechSynthesisVoice | null {
  if (lang2 in _voiceCache) return _voiceCache[lang2];
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;
  for (const v of _voices) {
    const sc = _scoreVoice(v, lang2);
    if (sc > bestScore) {
      bestScore = sc;
      best = v;
    }
  }
  _voiceCache[lang2] = best;
  return best;
}

function _speakTts(text: string, lang = 'en-US') {
  try {
    speechSynthesis.cancel();
    const lang2 = lang.slice(0, 2).toLowerCase();
    const v = _pickVoice(lang2);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = (v && v.lang) || lang;
    if (v) u.voice = v;
    // Warmer, less robotic cadence: a touch slower, natural pitch, full volume.
    u.rate = 0.92;
    u.pitch = 1.02;
    u.volume = 1;
    speechSynthesis.speak(u);
  } catch {
    // speechSynthesis unavailable on this device — fail silent, never block the UI.
  }
}

let _currentClip: HTMLAudioElement | null = null;

function _playClip(relPath: string, onFail: () => void, onEnded?: () => void) {
  try {
    speechSynthesis.cancel();
  } catch {
    /* no TTS on this device — clips still play */
  }
  try {
    if (_currentClip) _currentClip.pause();
    // BASE_URL doesn't reliably keep its trailing slash under trailingSlash:
    // 'never' (see astro.config.mjs), so normalize it before concatenating.
    const rawBase = import.meta.env.BASE_URL;
    const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
    const clip = new Audio(`${base}audio/${relPath}`);
    _currentClip = clip;
    clip.addEventListener('error', onFail);
    if (onEnded) clip.addEventListener('ended', onEnded);
    const p = clip.play();
    if (p && typeof p.catch === 'function') p.catch(onFail);
  } catch {
    onFail();
  }
}

/** Pre-generated neural clips for every audible app line, keyed by
 *  normalized text — one distinct voice per character (officer, receptionist,
 *  learner, Tía Marisol). Generated by scripts/generate-app-audio.py; the
 *  mp3s ship in the bundle, so playback is fully offline. */
const CLIPS: Record<string, Record<string, string>> = audioManifest;

function _clipFor(text: string, lang: string): string | undefined {
  const lang2 = lang.slice(0, 2).toLowerCase();
  return CLIPS[lang2]?.[normalizeSpoken(text)];
}

/** Speak `text` aloud — a pre-generated neural clip when this exact line has
 *  one, else on-device speechSynthesis. Neither path touches the network. */
export function speak(text: string, lang = 'en-US') {
  const file = _clipFor(text, lang);
  if (file) {
    _playClip(file, () => _speakTts(text, lang));
    return;
  }
  _speakTts(text, lang);
}

/** Speak several lines in sequence (e.g. the rights card's read-all),
 *  chaining clips so each finishes before the next begins. */
export function speakSeq(texts: string[], lang = 'en-US') {
  const next = (i: number) => {
    if (i >= texts.length) return;
    const file = _clipFor(texts[i], lang);
    if (file) {
      _playClip(file, () => _speakTts(texts.slice(i).join('. ')), () => next(i + 1));
    } else {
      // No clip for this line — hand the rest to TTS in one utterance.
      _speakTts(texts.slice(i).join('. '), lang);
    }
  };
  next(0);
}

/** Speak a Spanish phrase, preferring a pre-generated mp3 (public/audio/es/)
 *  over on-device TTS when the exact wording has one — see data.ts
 *  spanishAudioSlug(). Falls back to speechSynthesis otherwise. Both paths
 *  stay fully offline: the mp3s ship in the app bundle and are precached by
 *  the service worker (astro.config.mjs workbox globPatterns). */
export function speakEs(es: string) {
  const slug = spanishAudioSlug(es);
  if (slug) {
    _playClip(`es/${slug}.mp3`, () => _speakTts(es, 'es-MX'));
    return;
  }
  // No core-rights clip — speak() still finds app-level clips via the manifest.
  speak(es, 'es-MX');
}

// ---- shared atoms -----------------------------------------------------

export function Glyph({ topic, size = 42, radius = 13 }: { topic: TopicKey; size?: number; radius?: number }) {
  const t = TOPICS[topic];
  return (
    <span
      style={{
        width: size, height: size, borderRadius: radius, flex: '0 0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'center', background: topicSoft(t.hue), color: topicInk(t.hue),
        font: `400 ${Math.round(size * 0.5)}px ${C.round}`,
      }}
    >
      {t.glyph}
    </span>
  );
}

export function SpeakBtn({ text, hue = 250, light, onPlay }: { text: string; hue?: number; light?: boolean; onPlay?: () => void }) {
  const [on, setOn] = useState(false);
  const fg = light ? '#fff' : topicInk(hue);
  const bg = light ? 'rgba(255,255,255,0.22)' : topicSoft(hue);
  return (
    <button
      onClick={() => {
        speak(text);
        onPlay?.();
        setOn(true);
        setTimeout(() => setOn(false), 900);
      }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', cursor: 'pointer',
        background: bg, color: fg, borderRadius: 999, padding: '7px 13px', font: `800 12.5px ${C.round}`,
      }}
    >
      <span style={{ display: 'inline-block', transition: 'transform .2s', transform: on ? 'scale(1.25)' : 'scale(1)' }}>🔊</span>
      Escuchar
    </button>
  );
}

type PillKind = 'primary' | 'soft' | 'dark' | 'ghost';

export function Pill({
  children, onClick, kind = 'primary', hue = 250, full, style,
}: {
  children: ComponentChildren;
  onClick?: () => void;
  kind?: PillKind;
  hue?: number;
  full?: boolean;
  style?: JSX.CSSProperties;
}) {
  const map: Record<PillKind, JSX.CSSProperties> = {
    primary: { background: topicMid(hue), color: '#fff', boxShadow: C.shSoft },
    soft: { background: C.panel, color: topicInk(hue), boxShadow: C.sh },
    dark: { background: C.solid, color: '#fff', boxShadow: `inset 0 0 0 1px ${C.hairline}` },
    ghost: { background: 'transparent', color: C.ink, boxShadow: `inset 0 0 0 1.5px ${C.divider}` },
  };
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none', cursor: 'pointer', borderRadius: 16, padding: '15px 20px', font: `800 15px ${C.round}`,
        width: full ? '100%' : 'auto', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', gap: 9, ...map[kind], ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Narration({ children }: { children: ComponentChildren }) {
  return <div style={{ textAlign: 'center', font: `700 13px/1.45 ${C.round}`, color: C.dim, padding: '4px 24px', margin: '2px 0' }}>{children}</div>;
}

export function OtherBubble({ who, en, es, hue }: { who: string; en: string; es: string; hue: number }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      <span
        style={{
          width: 34, height: 34, flex: '0 0 auto', borderRadius: '50%', background: C.panel, boxShadow: C.sh,
          display: 'flex', alignItems: 'center', justifyContent: 'center', font: `800 9px ${C.round}`,
          color: topicInk(hue), textTransform: 'uppercase',
        }}
      >
        {who.slice(0, 2)}
      </span>
      <div style={{ background: C.panel, borderRadius: '6px 20px 20px 20px', padding: '13px 16px', boxShadow: C.sh, maxWidth: 290 }}>
        <div style={{ font: `800 17px/1.3 ${C.round}`, color: C.ink }}>{en}</div>
        <div style={{ font: `600 13px ${C.round}`, color: C.dim, marginTop: 5 }}>{es}</div>
        <div style={{ marginTop: 10 }}>
          <SpeakBtn text={en} hue={hue} />
        </div>
      </div>
    </div>
  );
}

export function GuiaBubble({ children, hue, label = 'Tía Marisol' }: { children: ComponentChildren; hue: number; label?: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
      <div style={{ background: topicMid(hue), color: '#fff', borderRadius: '20px 20px 6px 20px', padding: '13px 16px', boxShadow: C.sh, maxWidth: 290 }}>
        <div style={{ font: `800 10px ${C.round}`, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.82, marginBottom: 5 }}>💛 {label}</div>
        <div style={{ font: `600 14.5px/1.5 ${C.round}` }}>{children}</div>
      </div>
      <Guia size={34} ink="#fff" ring="rgba(255,255,255,0.45)" label="Tía" />
    </div>
  );
}

export function YouBubble({ en, es }: { en: string; es: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ background: C.solid, color: '#fff', borderRadius: '20px 20px 20px 6px', padding: '12px 16px', maxWidth: 280 }}>
        <div style={{ font: `800 16px/1.25 ${C.round}` }}>{en}</div>
        <div style={{ font: `600 12px ${C.round}`, opacity: 0.6, marginTop: 3 }}>{es}</div>
      </div>
    </div>
  );
}

export function ProgressBar({ value, hue }: { value: number; hue: number }) {
  return (
    <div style={{ height: 8, borderRadius: 6, background: C.panel, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${C.divider}` }}>
      <div
        style={{
          width: `${Math.round(value * 100)}%`, height: '100%', borderRadius: 6, background: topicMid(hue),
          transition: 'width .35s cubic-bezier(.2,.7,.3,1)',
        }}
      />
    </div>
  );
}

// A drop-in for the guide character — placeholder, not a hand-drawn person.
export function Guia({
  size = 44, ink = '#2a241d', ring = 'rgba(0,0,0,0.12)', label = 'guía',
}: {
  size?: number;
  ink?: string;
  ring?: string;
  label?: string;
}) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flex: '0 0 auto',
        // color-mix() (not a `${ink}14` hex-alpha suffix) so this still works
        // when `ink` is a var(--pd-ink) reference, not just a literal hex.
        background: `repeating-linear-gradient(135deg, color-mix(in oklab, ${ink} 14%, transparent) 0 4px, transparent 4px 8px)`,
        border: `1.5px solid ${ring}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: ink, font: `600 9px/1 ${C.round}`, letterSpacing: '0.5px', textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  );
}
