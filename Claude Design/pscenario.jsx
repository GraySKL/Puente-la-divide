// pscenario.jsx — the conversation simulator engine (branching + transcript).
function ScenarioRunner({ scenarioKey, onExit, onOpenRights, onComplete, wide }) {
  const sc = SCENARIOS[scenarioKey];
  const hue = TOPICS[scenarioKey].hue;
  const [step, setStep] = React.useState(0);
  const [chosen, setChosen] = React.useState({}); // idx -> optionIndex
  const [spoken, setSpoken] = React.useState({}); // idx -> { heard, ok }
  const scrollRef = React.useRef(null);
  const last = sc.steps.length - 1;
  const cur = sc.steps[step];
  const answered = chosen[step] != null;

  React.useEffect(() => {
    const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight + 400;
  }, [step, chosen, spoken]);

  const choose = (oi) => { setChosen((c) => ({ ...c, [step]: oi })); };
  const next = () => { if (step < last) setStep(step + 1); };
  const restart = () => { setChosen({}); setSpoken({}); setStep(0); };

  // build transcript of resolved steps
  const rows = [];
  for (let i = 0; i <= step; i++) {
    const s = sc.steps[i];
    if (s.t === 'scene') rows.push(<Narration key={i}>{s.emoji} {s.es}</Narration>);
    else if (s.t === 'say') rows.push(<div key={i} style={{ padding: '8px 0' }}><OtherBubble who={s.who} en={s.en} es={s.es} hue={hue} /></div>);
    else if (s.t === 'tip') rows.push(
      <div key={i} style={{ padding: '8px 0' }}>
        <GuiaBubble hue={hue}>
          {s.es}
          {s.phrase && <div style={{ marginTop: 8, padding: '8px 11px', borderRadius: 12, background: 'rgba(255,255,255,0.18)', font: `800 14px ${C.round}` }}>“{s.phrase}”</div>}
        </GuiaBubble>
      </div>);
    else if (s.t === 'speak') {
      rows.push(<div key={i + 'sp'} style={{ padding: '8px 0' }}><GuiaBubble hue={hue}>Ahora te toca a ti. Intenta decir esta frase en voz alta 👇</GuiaBubble></div>);
      if (spoken[i] != null) {
        rows.push(<div key={i + 'sy'} style={{ padding: '8px 0' }}><YouBubble en={spoken[i].heard || s.target.en} es={s.target.es} /></div>);
        rows.push(<div key={i + 'sr'} style={{ padding: '8px 0' }}><GuiaBubble hue={hue}>{spoken[i].ok ? '¡Perfecto! Esa frase ya suena tuya. 🌿' : 'Muy bien por intentarlo. Cada vez te sale más natural — repítela cuando quieras.'}</GuiaBubble></div>);
      }
    }
    else if (s.t === 'choose' && chosen[i] != null) {
      const op = s.options[chosen[i]];
      rows.push(<div key={i + 'y'} style={{ padding: '8px 0' }}><YouBubble en={op.en} es={op.es} /></div>);
      rows.push(<div key={i + 'r'} style={{ padding: '8px 0' }}><GuiaBubble hue={hue}>{op.reply}</GuiaBubble></div>);
    }
    else if (s.t === 'recap') rows.push(
      <div key={i} style={{ padding: '12px 0 4px' }}>
        <div style={{ background: '#fff', borderRadius: 22, padding: '22px 20px', boxShadow: C.sh, textAlign: 'center' }}>
          <div style={{ fontSize: 34 }}>🌿</div>
          <div style={{ font: `800 22px/1.2 ${C.round}`, color: C.ink, marginTop: 6 }}>¡Lo lograste!</div>
          <div style={{ font: `600 14px/1.5 ${C.round}`, color: C.dim, marginTop: 8 }}>{s.es}</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 9, textAlign: 'left' }}>
            {s.learned.map((p, k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, background: topicSoft(hue), borderRadius: 14, padding: '11px 14px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ font: `800 15px ${C.round}`, color: C.ink }}>{p.en}</div>
                  <div style={{ font: `600 12px ${C.round}`, color: C.dim }}>{p.es}</div>
                </div>
                <button onClick={() => speak(p.en)} style={{ border: 'none', cursor: 'pointer', width: 34, height: 34, borderRadius: '50%', background: '#fff', boxShadow: C.shSoft, fontSize: 14 }}>🔊</button>
              </div>
            ))}
          </div>
        </div>
      </div>);
  }

  const isChoosing = cur.t === 'choose' && !answered;
  const isSpeaking = cur.t === 'speak' && spoken[step] == null;
  const onRecap = cur.t === 'recap';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: topicSoft(hue), minHeight: 0 }}>
      {/* header */}
      <div style={{ flex: '0 0 auto', padding: '10px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onExit} aria-label="Salir" style={{ border: 'none', background: '#fff', boxShadow: C.shSoft, cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', font: `800 18px ${C.round}`, color: topicInk(hue) }}>‹</button>
          <div style={{ textAlign: 'center', lineHeight: 1.25 }}>
            <div style={{ font: `800 14px ${C.round}`, color: topicInk(hue) }}>{sc.title}</div>
            <div style={{ font: `700 10px ${C.round}`, letterSpacing: '0.6px', color: C.dim, textTransform: 'uppercase' }}>{sc.en}</div>
          </div>
          <button onClick={onOpenRights} title="Mis derechos" style={{ border: 'none', background: '#fff', boxShadow: C.shSoft, cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', fontSize: 15 }}>🛡️</button>
        </div>
        <div style={{ marginTop: 12 }}><ProgressBar value={(step) / last} hue={hue} /></div>
      </div>

      {/* transcript */}
      <div ref={scrollRef} style={{ flex: '1 1 auto', overflowY: 'auto', padding: `12px ${wide ? 26 : 18}px 8px`, minHeight: 0 }}>
        <div style={{ maxWidth: wide ? 560 : 'none', margin: '0 auto' }}>{rows}</div>
      </div>

      {/* control */}
      <div style={{ flex: '0 0 auto', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)', borderTop: '1px solid rgba(44,40,36,0.07)', padding: `14px ${wide ? 26 : 18}px` }}>
        <div style={{ maxWidth: wide ? 560 : 'none', margin: '0 auto' }}>
          {isChoosing && (
            <div>
              <div style={{ font: `800 11px ${C.round}`, letterSpacing: '1px', textTransform: 'uppercase', color: C.dim, marginBottom: 10 }}>{cur.prompt} · toca para decir</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cur.options.map((op, oi) => (
                  <button key={oi} onClick={() => choose(oi)} style={{ textAlign: 'left', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 18, background: '#fff', boxShadow: C.sh }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: `800 16px ${C.round}`, color: C.ink }}>{op.en}</div>
                      <div style={{ font: `600 12px ${C.round}`, color: C.dim, marginTop: 1 }}>{op.es}</div>
                    </div>
                    <span onClick={(e) => { e.stopPropagation(); speak(op.en); }} style={{ width: 32, height: 32, flex: '0 0 auto', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: topicSoft(hue), color: topicInk(hue), fontSize: 13 }}>🔊</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {isSpeaking && (
            <SpeakPractice target={cur.target} hue={hue} onDone={(heard, ok) => setSpoken((c) => ({ ...c, [step]: { heard, ok } }))} />
          )}
          {!isChoosing && !isSpeaking && !onRecap && (
            <Pill kind="primary" hue={hue} full onClick={next}>Continuar →</Pill>
          )}
          {onRecap && (
            <div style={{ display: 'flex', gap: 10 }}>
              <Pill kind="soft" hue={hue} onClick={restart} style={{ flex: 1 }}>↺ Otra vez</Pill>
              <Pill kind="primary" hue={hue} onClick={() => { onComplete && onComplete(scenarioKey); onExit(); }} style={{ flex: 1.6 }}>Volver al inicio</Pill>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScenarioRunner });
