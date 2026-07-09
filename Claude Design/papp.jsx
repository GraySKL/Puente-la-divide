// papp.jsx — orchestrator: state, routing, persistence, phone & desktop chrome.
const LS = 'puente_v1';
function loadState() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }
function saveState(s) { try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) {} }

function usePuente(surface) {
  const saved = React.useMemo(loadState, []);
  const [route, setRoute] = React.useState(surface === 'desktop' ? 'home' : (saved.onboarded ? 'home' : 'onboarding'));
  const [topic, setTopic] = React.useState('parada');
  const [completed, setCompleted] = React.useState(saved.completed || {});
  const [rightsOpen, setRightsOpen] = React.useState(false);
  const [discreet, setDiscreet] = React.useState(false);

  React.useEffect(() => { saveState({ ...loadState(), completed, onboarded: route !== 'onboarding' ? true : loadState().onboarded }); }, [completed, route]);

  const h = {
    finishOnboarding: () => { saveState({ ...loadState(), onboarded: true }); setRoute('home'); },
    goHome: () => { setRoute('home'); },
    pick: (k) => { setTopic(k); setRoute(LOCKED[k] ? 'comingsoon' : 'scenario'); },
    complete: (k) => setCompleted((c) => ({ ...c, [k]: true })),
    openRights: () => setRightsOpen(true),
    closeRights: () => setRightsOpen(false),
    nav: (r) => { if (r === 'derechos') setRightsOpen(true); else if (r === 'salir') setDiscreet(true); else setRoute(r); },
    exitDiscreet: () => setDiscreet(false),
  };
  return { st: { route, topic, completed, rightsOpen, discreet }, h };
}

function activeScreen(st, h, wide) {
  switch (st.route) {
    case 'onboarding': return <Onboarding wide={wide} onDone={h.finishOnboarding} />;
    case 'scenario': return <ScenarioRunner scenarioKey={st.topic} wide={wide} onExit={h.goHome} onOpenRights={h.openRights} onComplete={h.complete} />;
    case 'phrasebook': return <Phrasebook wide={wide} />;
    case 'comingsoon': return <ComingSoon topic={st.topic} onClose={h.goHome} />;
    default: return <Home wide={wide} completed={st.completed} onPick={h.pick} />;
  }
}

// ---------- PHONE ----------
function TabBar({ route, onNav }) {
  const items = [['home', '🏠', 'Hoy'], ['phrasebook', '💬', 'Frases'], ['derechos', '🛡️', 'Derechos'], ['salir', '🙈', 'Salir']];
  return (
    <div style={{ flex: '0 0 auto', display: 'flex', gap: 4, padding: '8px 12px 4px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(44,40,36,0.07)' }}>
      {items.map(([k, ic, l]) => {
        const on = route === k || (k === 'home' && route === 'home');
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

function PhoneChrome({ st, h }) {
  const showTabs = st.route === 'home' || st.route === 'phrasebook';
  return (
    <PhoneFrame dark={false} bg={C.bg}>
      <div style={{ position: 'relative', flex: '1 1 auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>{activeScreen(st, h, false)}</div>
        {showTabs && <TabBar route={st.route} onNav={h.nav} />}
        {st.rightsOpen && <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}><RightsCard topic={st.topic} onClose={h.closeRights} /></div>}
        {st.discreet && <div style={{ position: 'absolute', inset: 0, zIndex: 9 }}><DiscreetCover onUnlock={h.exitDiscreet} /></div>}
      </div>
    </PhoneFrame>
  );
}

function PhoneApp() { const { st, h } = usePuente('phone'); return <PhoneChrome st={st} h={h} />; }

// ---------- DESKTOP ----------
function Sidebar({ st, h }) {
  const items = [['home', '🏠', 'Hoy'], ['phrasebook', '💬', 'Mis frases']];
  return (
    <div style={{ width: 240, flex: '0 0 auto', background: '#fff', borderRight: '1px solid rgba(44,40,36,0.08)', display: 'flex', flexDirection: 'column', padding: '20px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 18px' }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: topicMid(250), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', font: `800 15px ${C.round}` }}>P</span>
        <span style={{ font: `800 16px ${C.round}`, color: C.ink }}>Puente</span>
      </div>
      {items.map(([k, ic, l]) => {
        const on = st.route === k;
        return (
          <button key={k} onClick={() => h.nav(k)} style={{ border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px', borderRadius: 12, background: on ? topicSoft(250) : 'transparent', font: `800 14px ${C.round}`, color: on ? topicInk(250) : C.ink, marginBottom: 2 }}>
            <span style={{ fontSize: 17 }}>{ic}</span>{l}
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <button onClick={() => h.nav('derechos')} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px', borderRadius: 14, background: C.ink, color: '#fff', font: `800 14px ${C.round}`, whiteSpace: 'nowrap', marginBottom: 10 }}>🛡️ Mis derechos</button>
      <button onClick={() => h.nav('salir')} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'transparent', color: C.dim, font: `700 13px ${C.round}`, whiteSpace: 'nowrap' }}>🙈 Salida rápida</button>
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

function DesktopChrome({ st, h }) {
  const wideScreens = st.route === 'home' || st.route === 'phrasebook';
  return (
    <div style={{ width: 1100, height: 720, borderRadius: 14, overflow: 'hidden', boxShadow: '0 40px 90px -30px rgba(40,30,20,0.5)', background: '#fff', display: 'flex', flexDirection: 'column', border: '1px solid rgba(44,40,36,0.1)' }}>
      {/* title bar */}
      <div style={{ flex: '0 0 auto', height: 40, background: '#f1ede6', borderBottom: '1px solid rgba(44,40,36,0.08)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
        <div style={{ flex: 1, textAlign: 'center', font: `700 12px ${C.round}`, color: C.dim }}>Puente la Divide</div>
        <div style={{ width: 52 }} />
      </div>
      <div style={{ flex: '1 1 auto', display: 'flex', minHeight: 0, position: 'relative' }}>
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
            <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'rgba(30,24,18,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={h.closeRights}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: 430, height: 600, borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)' }}>
                <RightsCard topic={st.topic} onClose={h.closeRights} />
              </div>
            </div>
          )}
          {st.discreet && <div style={{ position: 'absolute', inset: 0, zIndex: 9 }}><DiscreetCover onUnlock={h.exitDiscreet} /></div>}
        </div>
      </div>
    </div>
  );
}

function DesktopApp() { const { st, h } = usePuente('desktop'); return <DesktopChrome st={st} h={h} />; }

Object.assign(window, { PhoneApp, DesktopApp });
