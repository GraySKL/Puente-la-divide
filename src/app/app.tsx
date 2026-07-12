// src/app/app.tsx — orchestrator: state, routing, localStorage persistence,
// and the responsive narrow/wide chrome. Ported from Claude Design/papp.jsx.
//
// The prototype mounted two separate demo shells (PhoneApp inside a fake
// phone bezel, DesktopApp inside a fake macOS window) side by side for
// comparison. In the real app this island IS the whole app, edge to edge —
// there's no bezel or title bar to fake, the real device/browser already
// draws one. What's kept is the underlying idea: a narrow layout (bottom tab
// bar) and a wide layout (sidebar), chosen responsively from viewport width.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { getGuide, LOCKED, type AddressPref, type GuidePref, type TopicKey } from './data';
import { C, Guia, setGuidePref, setVoicePref, speak, speakEs, topicInk, topicMid, topicSoft, type VoicePref } from './ui';
import { ComingSoon, Home, NameEditor, NorteCarolina, Onboarding, Phrasebook, Preparate, RightsCard } from './screens';
import { ScenarioRunner } from './scenario';

const LS_KEY = 'puente_v1';

type Theme = 'auto' | 'light' | 'dark';
const THEME_ICON: Record<Theme, string> = { auto: '🌗', dark: '🌙', light: '☀️' };
const THEME_LABEL: Record<Theme, string> = { auto: '🌗 Auto', dark: '🌙 Oscuro', light: '☀️ Claro' };
const THEME_NEXT: Record<Theme, Theme> = { auto: 'dark', dark: 'light', light: 'auto' };

// Learner-voice preference — which voice reads the LEARNER's own lines back
// to them (see ui.tsx setVoicePref). Character voices (officer, receptionist,
// Tía Marisol, Aria narration) are fixed and never change with this pref.
const VOICE_ICON: Record<VoicePref, string> = { f: '🙋‍♀️', m: '🙋‍♂️' };
const VOICE_LABEL: Record<VoicePref, string> = { f: '🙋‍♀️ Voz', m: '🙋‍♂️ Voz' };
const VOICE_NEXT: Record<VoicePref, VoicePref> = { f: 'm', m: 'f' };
// Canonical confirmation line, spoken in the new voice right after a Settings
// toggle so the user can hear the difference immediately (never during
// onboarding — no autoplay before the user's first gesture there).
const VOICE_CONFIRM_LINE = 'I want to remain silent.';

// Guide preference — which character walks the learner through scenes (see
// ui.tsx setGuidePref / data.ts getGuide). Settings toggle shows the short
// form ('Tía'/'Tío'); GUIDE_NEXT flips between the two on tap.
const GUIDE_NEXT: Record<GuidePref, GuidePref> = { marisol: 'mateo', mateo: 'marisol' };
// Canonical confirmation line, spoken in Spanish in the new guide voice.
const GUIDE_CONFIRM_LINE = 'Quiero permanecer en silencio.';

const NAME_MAX = 24;

interface Persisted {
  completed?: Record<string, boolean>;
  onboarded?: boolean;
  prep?: Record<string, boolean>;
  theme?: Theme;
  voice?: VoicePref;
  guide?: GuidePref;
  // Display name only — never leaves the device (localStorage, same as
  // every other field here); empty string means "not set / skipped".
  name?: string;
  address?: AddressPref;
}

function loadState(): Persisted {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {};
  } catch {
    return {};
  }
}
function saveState(s: Persisted) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    // localStorage unavailable (private mode / storage full) — state just won't persist.
  }
}

type Route = 'onboarding' | 'home' | 'scenario' | 'phrasebook' | 'preparate' | 'comingsoon' | 'nc';

// One history entry per in-app view (see the history effects in usePuente):
// everything popstate needs to restore that view, plus `d` = how many
// entries deep we are, so back() never walks out of the app itself.
interface NavSnapshot {
  route?: Route;
  topic?: TopicKey;
  rights?: boolean;
  editor?: boolean;
  d?: number;
}

interface PuenteState {
  route: Route;
  topic: TopicKey;
  completed: Record<string, boolean>;
  prep: Record<string, boolean>;
  rightsOpen: boolean;
  theme: Theme;
  voice: VoicePref;
  guide: GuidePref;
  name: string;
  address: AddressPref;
  nameEditorOpen: boolean;
}

interface PuenteHandlers {
  finishOnboarding: () => void;
  goHome: () => void;
  pick: (k: TopicKey) => void;
  complete: (k: TopicKey) => void;
  togglePrep: (id: string) => void;
  openRights: () => void;
  closeRights: () => void;
  nav: (r: string) => void;
  back: () => void;
  cycleTheme: () => void;
  pickVoice: (v: VoicePref) => void;
  cycleVoice: () => void;
  pickGuide: (v: GuidePref) => void;
  cycleGuide: () => void;
  pickName: (name: string) => void;
  pickAddress: (v: AddressPref) => void;
  openNameEditor: () => void;
  closeNameEditor: () => void;
  saveNameEditor: (name: string, address: AddressPref) => void;
}

function usePuente() {
  const saved = useMemo(loadState, []);
  const [route, setRoute] = useState<Route>(saved.onboarded ? 'home' : 'onboarding');
  const [topic, setTopic] = useState<TopicKey>('parada');
  const [completed, setCompleted] = useState<Record<string, boolean>>(saved.completed || {});
  const [prep, setPrep] = useState<Record<string, boolean>>(saved.prep || {});
  const [rightsOpen, setRightsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(saved.theme || 'auto');
  const [voice, setVoice] = useState<VoicePref>(saved.voice || 'f');
  const [guide, setGuide] = useState<GuidePref>(saved.guide || 'marisol');
  const [name, setName] = useState<string>(saved.name || '');
  const [address, setAddress] = useState<AddressPref>(saved.address || 'f');
  const [nameEditorOpen, setNameEditorOpen] = useState(false);

  useEffect(() => {
    saveState({ ...loadState(), completed, prep, theme, voice, guide, name, address, onboarded: route !== 'onboarding' ? true : loadState().onboarded });
  }, [completed, prep, route, theme, voice, guide, name, address]);

  // Push the current preferences into ui.tsx's module-level setters — on
  // load (this effect's first run) and every time either changes.
  // speak()/speakEs()/_clipFor() read them synchronously, never
  // localStorage, on the hot path.
  useEffect(() => {
    setVoicePref(voice);
  }, [voice]);
  useEffect(() => {
    setGuidePref(guide);
  }, [guide]);

  // ---- browser-history integration ----------------------------------
  // Each view change pushes a history entry, so the platform back gesture
  // (iOS edge swipe, Android back swipe/button, browser back) returns to
  // the previous in-app view instead of leaving the app. popstate restores
  // the stored snapshot; `fromPop` keeps the push effect from re-pushing
  // what popstate just applied.
  const fromPop = useRef(false);
  const depth = useRef(0);
  const prevRoute = useRef<Route | null>(null);
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = (e.state || {}) as NavSnapshot;
      fromPop.current = true;
      depth.current = s.d || 0;
      setRoute(s.route || 'home');
      if (s.topic) setTopic(s.topic);
      setRightsOpen(!!s.rights);
      setNameEditorOpen(!!s.editor);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    if (fromPop.current) {
      fromPop.current = false;
      prevRoute.current = route;
      return;
    }
    // First run stamps the current entry instead of pushing; so does
    // leaving onboarding, so back from Home never reopens a finished
    // onboarding (Home is the app's base — back from there exits, as the
    // platform expects).
    const replace = prevRoute.current === null || prevRoute.current === 'onboarding';
    if (!replace) depth.current += 1;
    const snap: NavSnapshot = { route, topic, rights: rightsOpen, editor: nameEditorOpen, d: depth.current };
    if (replace) history.replaceState(snap, '');
    else history.pushState(snap, '');
    prevRoute.current = route;
  }, [route, topic, rightsOpen, nameEditorOpen]);

  const h: PuenteHandlers = {
    finishOnboarding: () => { saveState({ ...loadState(), onboarded: true }); setRoute('home'); },
    goHome: () => setRoute('home'),
    pick: (k) => { setTopic(k); setRoute(LOCKED[k] ? 'comingsoon' : 'scenario'); },
    complete: (k) => setCompleted((c) => ({ ...c, [k]: true })),
    togglePrep: (id) => setPrep((p) => ({ ...p, [id]: !p[id] })),
    openRights: () => setRightsOpen(true),
    // Closing an overlay pops the entry its opening pushed (when it did),
    // so back afterwards doesn't reopen it; popstate does the actual close.
    closeRights: () => {
      if (depth.current > 0 && (history.state as NavSnapshot | null)?.rights) history.back();
      else setRightsOpen(false);
    },
    nav: (r) => {
      if (r === 'derechos') setRightsOpen(true);
      else setRoute(r as Route);
    },
    back: () => {
      if (depth.current > 0) history.back();
    },
    cycleTheme: () => setTheme((t) => THEME_NEXT[t]),
    // Onboarding's voice-choice panel: store the pick, no confirmation audio
    // (no autoplay before the user's first gesture during onboarding).
    pickVoice: (v) => setVoice(v),
    // Settings toggle (both chromes): flip the pref and immediately speak a
    // canonical learner line in the new voice so the change is audible right
    // away — the toggle tap IS the user gesture, so this is allowed.
    cycleVoice: () => {
      const next = VOICE_NEXT[voice];
      setVoicePref(next); // sync ui.tsx's module var before speak() below
      setVoice(next);
      speak(VOICE_CONFIRM_LINE, 'en-US');
    },
    // Onboarding's guide-choice panel: store the pick, no confirmation audio.
    pickGuide: (v) => setGuide(v),
    // Settings toggle (both chromes): flip the pref and speak a Spanish
    // confirmation line in the new guide voice — same pattern as cycleVoice.
    cycleGuide: () => {
      const next = GUIDE_NEXT[guide];
      setGuidePref(next); // sync ui.tsx's module var before speakEs() below
      setGuide(next);
      speakEs(GUIDE_CONFIRM_LINE);
    },
    // Onboarding's name/address panel: store the pick(s), no confirmation
    // audio (name/address are text-only, never spoken — see data.ts
    // resolveAddress's CRITICAL AUDIO CHECK note).
    pickName: (n) => setName(n.trim().slice(0, NAME_MAX)),
    pickAddress: (v) => setAddress(v),
    // Settings: tapping your own identity (Home greeting / sidebar row)
    // opens the same editor either place — see screens.tsx NameEditor.
    openNameEditor: () => setNameEditorOpen(true),
    // Same pop-on-close pattern as closeRights, so back never reopens it.
    closeNameEditor: () => {
      if (depth.current > 0 && (history.state as NavSnapshot | null)?.editor) history.back();
      else setNameEditorOpen(false);
    },
    saveNameEditor: (n, v) => {
      setName(n.trim().slice(0, NAME_MAX));
      setAddress(v);
      if (depth.current > 0 && (history.state as NavSnapshot | null)?.editor) history.back();
      else setNameEditorOpen(false);
    },
  };
  return { st: { route, topic, completed, prep, rightsOpen, theme, voice, guide, name, address, nameEditorOpen } as PuenteState, h };
}

function activeScreen(st: PuenteState, h: PuenteHandlers, wide: boolean): JSX.Element {
  switch (st.route) {
    case 'onboarding':
      return (
        <Onboarding
          wide={wide}
          onDone={h.finishOnboarding}
          onPickVoice={h.pickVoice}
          onPickGuide={h.pickGuide}
          onPickName={h.pickName}
          onPickAddress={h.pickAddress}
        />
      );
    case 'scenario':
      return (
        <ScenarioRunner
          scenarioKey={st.topic}
          wide={wide}
          onExit={h.goHome}
          onOpenRights={h.openRights}
          onComplete={h.complete}
          guide={st.guide}
          name={st.name}
          address={st.address}
        />
      );
    case 'phrasebook':
      return <Phrasebook wide={wide} />;
    case 'preparate':
      return <Preparate wide={wide} checked={st.prep} onToggle={h.togglePrep} guide={st.guide} />;
    case 'nc':
      return <NorteCarolina wide={wide} onPick={h.pick} onNav={h.nav} guide={st.guide} address={st.address} />;
    case 'comingsoon':
      return <ComingSoon topic={st.topic} onClose={h.goHome} />;
    default:
      return (
        <Home
          wide={wide}
          completed={st.completed}
          onPick={h.pick}
          onOpenNc={() => h.nav('nc')}
          guide={st.guide}
          name={st.name}
          onEditName={h.openNameEditor}
        />
      );
  }
}

// ---------- NARROW (tab bar) ----------
function TabBar({
  route, onNav, theme, onCycleTheme, voice, onCycleVoice, guide, onCycleGuide,
}: {
  route: Route;
  onNav: (r: string) => void;
  theme: Theme;
  onCycleTheme: () => void;
  voice: VoicePref;
  onCycleVoice: () => void;
  guide: GuidePref;
  onCycleGuide: () => void;
}) {
  const items: [string, string, string][] = [
    ['home', '🏠', 'Hoy'],
    ['phrasebook', '💬', 'Frases'],
    ['preparate', '🧳', 'Prepárate'],
    ['nc', '📍', 'En NC'],
    ['derechos', '🛡️', 'Derechos'],
  ];
  return (
    <div
      style={{
        flex: '0 0 auto', display: 'flex', gap: 4, padding: '8px 12px calc(4px + env(safe-area-inset-bottom, 0px))',
        background: C.chrome, backdropFilter: 'blur(8px)', borderTop: `1px solid ${C.divider}`,
      }}
    >
      {items.map(([k, ic, l]) => {
        const on = route === k;
        const accent = k === 'derechos';
        return (
          <button key={k} onClick={() => onNav(k)} style={{ flex: 1, border: 'none', cursor: 'pointer', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '5px 0' }}>
            <span style={{ fontSize: 19, filter: on || accent ? 'none' : 'grayscale(1)', opacity: on || accent ? 1 : 0.5 }}>{ic}</span>
            <span style={{ font: `${on ? 800 : 700} 10px ${C.round}`, color: accent ? topicInk(250) : on ? C.ink : C.faint }}>{l}</span>
          </button>
        );
      })}
      <button
        onClick={onCycleTheme}
        aria-label={`Tema: ${THEME_LABEL[theme]}`}
        title={THEME_LABEL[theme]}
        style={{ flex: '0 0 auto', border: 'none', cursor: 'pointer', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '5px 6px' }}
      >
        <span style={{ fontSize: 19, opacity: 0.6 }}>{THEME_ICON[theme]}</span>
      </button>
      <button
        onClick={onCycleVoice}
        aria-label={`Voz de tus frases: ${VOICE_LABEL[voice]}`}
        title={VOICE_LABEL[voice]}
        style={{ flex: '0 0 auto', border: 'none', cursor: 'pointer', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '5px 6px' }}
      >
        <span style={{ fontSize: 19, opacity: 0.6 }}>{VOICE_ICON[voice]}</span>
      </button>
      <button
        onClick={onCycleGuide}
        aria-label={`Tu guía: ${getGuide(guide).nombre}`}
        title={getGuide(guide).nombre}
        style={{ flex: '0 0 auto', border: 'none', cursor: 'pointer', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '5px 6px' }}
      >
        <span style={{ fontSize: 19, opacity: 0.6 }}>{guide === 'mateo' ? '🙋‍♂️' : '🙋‍♀️'}</span>
      </button>
    </div>
  );
}

function NarrowChrome({ st, h }: { st: PuenteState; h: PuenteHandlers }) {
  const showTabs = st.route === 'home' || st.route === 'phrasebook' || st.route === 'preparate' || st.route === 'nc';
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>{activeScreen(st, h, false)}</div>
      {showTabs && (
        <TabBar
          route={st.route}
          onNav={h.nav}
          theme={st.theme}
          onCycleTheme={h.cycleTheme}
          voice={st.voice}
          onCycleVoice={h.cycleVoice}
          guide={st.guide}
          onCycleGuide={h.cycleGuide}
        />
      )}
      {st.rightsOpen && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
          <RightsCard topic={st.topic} onClose={h.closeRights} />
        </div>
      )}
    </div>
  );
}

// ---------- WIDE (sidebar) ----------
function Sidebar({ st, h }: { st: PuenteState; h: PuenteHandlers }) {
  const items: [Route, string, string][] = [
    ['home', '🏠', 'Hoy'],
    ['phrasebook', '💬', 'Mis frases'],
    ['preparate', '🧳', 'Prepárate'],
    ['nc', '📍', 'En Carolina del Norte'],
  ];
  return (
    <div style={{ width: 240, flex: '0 0 auto', background: C.panel, borderRight: `1px solid ${C.divider}`, display: 'flex', flexDirection: 'column', padding: '20px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 18px' }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: topicMid(250), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', font: `800 15px ${C.round}` }}>P</span>
        <span style={{ font: `800 16px ${C.round}`, color: C.ink }}>Puente</span>
      </div>
      {items.map(([k, ic, l]) => {
        const on = st.route === k;
        return (
          <button
            key={k}
            onClick={() => h.nav(k)}
            style={{ border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px', borderRadius: 12, background: on ? topicSoft(250) : 'transparent', font: `800 14px ${C.round}`, color: on ? topicInk(250) : C.ink, marginBottom: 2 }}
          >
            <span style={{ fontSize: 17 }}>{ic}</span>
            {l}
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <button onClick={() => h.nav('derechos')} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px', borderRadius: 14, background: C.solid, color: '#fff', boxShadow: `inset 0 0 0 1px ${C.hairline}`, font: `800 14px ${C.round}`, whiteSpace: 'nowrap', marginBottom: 10 }}>
        🛡️ Mis derechos
      </button>
      <button
        onClick={h.cycleTheme}
        title={THEME_LABEL[st.theme]}
        style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'transparent', color: C.dim, font: `700 13px ${C.round}`, whiteSpace: 'nowrap', marginBottom: 2 }}
      >
        {THEME_LABEL[st.theme]}
      </button>
      <button
        onClick={h.cycleVoice}
        title={VOICE_LABEL[st.voice]}
        style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'transparent', color: C.dim, font: `700 13px ${C.round}`, whiteSpace: 'nowrap', marginBottom: 2 }}
      >
        {VOICE_LABEL[st.voice]}
      </button>
      <button
        onClick={h.cycleGuide}
        title={getGuide(st.guide).nombre}
        style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'transparent', color: C.dim, font: `700 13px ${C.round}`, whiteSpace: 'nowrap', marginBottom: 2 }}
      >
        {st.guide === 'mateo' ? '🙋‍♂️' : '🙋‍♀️'} {getGuide(st.guide).short}
      </button>
      {/* Tapping your own identity opens name/address editing (owner
          decision 2026-07-10) — narrow-chrome counterpart is the Home
          greeting, see screens.tsx Home + NameEditor. */}
      <div
        onClick={h.openNameEditor}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, padding: '12px 8px 2px', marginTop: 6, borderTop: `1px solid ${C.divider}` }}
      >
        <Guia size={32} ink={C.ink} ring={C.divider} label={st.name ? st.name.slice(0, 2).toUpperCase() : 'TÚ'} />
        <div style={{ flex: 1 }}>
          {/* Never a fallback fake name — just the name (if set) or the
              neutral status line alone. */}
          {st.name && <div style={{ font: `800 13px ${C.round}`, color: C.ink }}>{st.name}</div>}
          <div style={{ font: `700 10px ${C.round}`, color: topicInk(155) }}>● Sin red · listo</div>
        </div>
      </div>
    </div>
  );
}

function WideChrome({ st, h }: { st: PuenteState; h: PuenteHandlers }) {
  const wideScreens = st.route === 'home' || st.route === 'phrasebook' || st.route === 'preparate' || st.route === 'nc';
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', minHeight: 0, position: 'relative', background: C.bg }}>
      <Sidebar st={st} h={h} />
      <div style={{ flex: '1 1 auto', minWidth: 0, background: C.bg, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {st.route === 'scenario' ? (
          <div style={{ flex: 1, minHeight: 0 }}>{activeScreen(st, h, true)}</div>
        ) : (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: wideScreens ? '28px 40px' : 0 }}>
            <div style={{ maxWidth: wideScreens ? 760 : 'none', margin: '0 auto', height: wideScreens ? 'auto' : '100%' }}>{activeScreen(st, h, true)}</div>
          </div>
        )}
        {st.rightsOpen && (
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'rgba(30,24,18,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={h.closeRights}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ width: 430, height: 600, borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)' }}>
              <RightsCard topic={st.topic} onClose={h.closeRights} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const WIDE_BREAKPOINT = 860;

function useIsWide(): boolean {
  const [wide, setWide] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= WIDE_BREAKPOINT : false));
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= WIDE_BREAKPOINT);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return wide;
}

export default function App() {
  const { st, h } = usePuente();
  const wide = useIsWide();
  // Edge-swipe fallback: installed iOS PWAs have no system back gesture, so
  // a right-swipe that starts at the left screen edge walks back one view
  // through the same history entries the platform gestures use. Where the
  // system already owns the edge (Android gesture nav), this simply never
  // fires — the system gesture wins and does the same thing. Attached with
  // addEventListener, not JSX props: Preact resolves onTouchStart to the
  // wrong event name on browsers that don't expose ontouchstart.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let start: { x: number; y: number } | null = null;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      start = t && t.clientX <= 30 ? { x: t.clientX, y: t.clientY } : null;
    };
    const onEnd = (e: TouchEvent) => {
      const s = start;
      start = null;
      const t = e.changedTouches[0];
      if (s && t && t.clientX - s.x > 70 && Math.abs(t.clientY - s.y) < 60) h.back();
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    };
  }, []);
  return (
    // .pd-app carries the theme CSS variables (see src/pages/app.astro);
    // data-theme is only set for a manual pick — 'auto' leaves it unset so
    // the stylesheet's @media (prefers-color-scheme) rule applies.
    <div
      ref={rootRef}
      class="pd-app"
      data-theme={st.theme === 'auto' ? undefined : st.theme}
      style={{ height: '100%', width: '100%' }}
    >
      {wide ? <WideChrome st={st} h={h} /> : <NarrowChrome st={st} h={h} />}
      {/* Rendered once at the top level (not per-chrome) so it overlays
          either layout identically — triggered from Home's greeting
          (narrow) or the sidebar identity row (wide). */}
      {st.nameEditorOpen && <NameEditor name={st.name} address={st.address} onSave={h.saveNameEditor} onClose={h.closeNameEditor} />}
    </div>
  );
}
