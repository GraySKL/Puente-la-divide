// src/app/app.tsx — orchestrator: state, routing, localStorage persistence,
// and the responsive narrow/wide chrome. Ported from Claude Design/papp.jsx.
//
// The prototype mounted two separate demo shells (PhoneApp inside a fake
// phone bezel, DesktopApp inside a fake macOS window) side by side for
// comparison. In the real app this island IS the whole app, edge to edge —
// there's no bezel or title bar to fake, the real device/browser already
// draws one. What's kept is the underlying idea: a narrow layout (bottom tab
// bar) and a wide layout (sidebar), chosen responsively from viewport width.
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { LOCKED, type TopicKey } from './data';
import { C, Guia, topicInk, topicMid, topicSoft } from './ui';
import { ComingSoon, DiscreetCover, Home, Onboarding, Phrasebook, RightsCard } from './screens';
import { ScenarioRunner } from './scenario';

const LS_KEY = 'puente_v1';

interface Persisted {
  completed?: Record<string, boolean>;
  onboarded?: boolean;
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

type Route = 'onboarding' | 'home' | 'scenario' | 'phrasebook' | 'comingsoon';

interface PuenteState {
  route: Route;
  topic: TopicKey;
  completed: Record<string, boolean>;
  rightsOpen: boolean;
  discreet: boolean;
}

interface PuenteHandlers {
  finishOnboarding: () => void;
  goHome: () => void;
  pick: (k: TopicKey) => void;
  complete: (k: TopicKey) => void;
  openRights: () => void;
  closeRights: () => void;
  nav: (r: string) => void;
  exitDiscreet: () => void;
}

function usePuente() {
  const saved = useMemo(loadState, []);
  const [route, setRoute] = useState<Route>(saved.onboarded ? 'home' : 'onboarding');
  const [topic, setTopic] = useState<TopicKey>('parada');
  const [completed, setCompleted] = useState<Record<string, boolean>>(saved.completed || {});
  const [rightsOpen, setRightsOpen] = useState(false);
  const [discreet, setDiscreet] = useState(false);

  useEffect(() => {
    saveState({ ...loadState(), completed, onboarded: route !== 'onboarding' ? true : loadState().onboarded });
  }, [completed, route]);

  const h: PuenteHandlers = {
    finishOnboarding: () => { saveState({ ...loadState(), onboarded: true }); setRoute('home'); },
    goHome: () => setRoute('home'),
    pick: (k) => { setTopic(k); setRoute(LOCKED[k] ? 'comingsoon' : 'scenario'); },
    complete: (k) => setCompleted((c) => ({ ...c, [k]: true })),
    openRights: () => setRightsOpen(true),
    closeRights: () => setRightsOpen(false),
    nav: (r) => {
      if (r === 'derechos') setRightsOpen(true);
      else if (r === 'salir') setDiscreet(true);
      else setRoute(r as Route);
    },
    exitDiscreet: () => setDiscreet(false),
  };
  return { st: { route, topic, completed, rightsOpen, discreet } as PuenteState, h };
}

function activeScreen(st: PuenteState, h: PuenteHandlers, wide: boolean): JSX.Element {
  switch (st.route) {
    case 'onboarding':
      return <Onboarding wide={wide} onDone={h.finishOnboarding} />;
    case 'scenario':
      return <ScenarioRunner scenarioKey={st.topic} wide={wide} onExit={h.goHome} onOpenRights={h.openRights} onComplete={h.complete} />;
    case 'phrasebook':
      return <Phrasebook wide={wide} />;
    case 'comingsoon':
      return <ComingSoon topic={st.topic} onClose={h.goHome} />;
    default:
      return <Home wide={wide} completed={st.completed} onPick={h.pick} />;
  }
}

// ---------- NARROW (tab bar) ----------
function TabBar({ route, onNav }: { route: Route; onNav: (r: string) => void }) {
  const items: [string, string, string][] = [
    ['home', '🏠', 'Hoy'],
    ['phrasebook', '💬', 'Frases'],
    ['derechos', '🛡️', 'Derechos'],
    ['salir', '🙈', 'Salir'],
  ];
  return (
    <div
      style={{
        flex: '0 0 auto', display: 'flex', gap: 4, padding: '8px 12px calc(4px + env(safe-area-inset-bottom, 0px))',
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(44,40,36,0.07)',
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
    </div>
  );
}

function NarrowChrome({ st, h }: { st: PuenteState; h: PuenteHandlers }) {
  const showTabs = st.route === 'home' || st.route === 'phrasebook';
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>{activeScreen(st, h, false)}</div>
      {showTabs && <TabBar route={st.route} onNav={h.nav} />}
      {st.rightsOpen && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
          <RightsCard topic={st.topic} onClose={h.closeRights} />
        </div>
      )}
      {st.discreet && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 9 }}>
          <DiscreetCover onUnlock={h.exitDiscreet} />
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
  ];
  return (
    <div style={{ width: 240, flex: '0 0 auto', background: '#fff', borderRight: '1px solid rgba(44,40,36,0.08)', display: 'flex', flexDirection: 'column', padding: '20px 16px' }}>
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
      <button onClick={() => h.nav('derechos')} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px', borderRadius: 14, background: C.ink, color: '#fff', font: `800 14px ${C.round}`, whiteSpace: 'nowrap', marginBottom: 10 }}>
        🛡️ Mis derechos
      </button>
      <button onClick={() => h.nav('salir')} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'transparent', color: C.dim, font: `700 13px ${C.round}`, whiteSpace: 'nowrap' }}>
        🙈 Salida rápida
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 8px 2px', marginTop: 6, borderTop: '1px solid rgba(44,40,36,0.08)' }}>
        <Guia size={32} ink={C.ink} ring="rgba(0,0,0,0.1)" label="R" />
        <div style={{ flex: 1 }}>
          <div style={{ font: `800 13px ${C.round}`, color: C.ink }}>Rosa</div>
          <div style={{ font: `700 10px ${C.round}`, color: topicInk(155) }}>● Sin red · listo</div>
        </div>
      </div>
    </div>
  );
}

function WideChrome({ st, h }: { st: PuenteState; h: PuenteHandlers }) {
  const wideScreens = st.route === 'home' || st.route === 'phrasebook';
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
        {st.discreet && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 9 }}>
            <DiscreetCover onUnlock={h.exitDiscreet} />
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
  return wide ? <WideChrome st={st} h={h} /> : <NarrowChrome st={st} h={h} />;
}
