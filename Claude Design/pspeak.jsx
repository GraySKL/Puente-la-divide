// pspeak.jsx — "Ahora dilo tú": the speaking-practice control.
// Uses browser SpeechRecognition live; production swaps in on-device Whisper
// behind the same shape. Always degrades gracefully so it never dead-ends.
function SpeakPractice({ target, hue, onDone }) {
  const [phase, setPhase] = React.useState('idle'); // idle | listening | scored | error
  const [heard, setHeard] = React.useState('');
  const [interim, setInterim] = React.useState('');
  const [score, setScore] = React.useState(0);
  const [errKind, setErrKind] = React.useState('');
  const stopRef = React.useRef(null);
  const available = speechRecognitionAvailable();
  React.useEffect(() => () => { if (stopRef.current) stopRef.current(); }, []);

  const finish = (txt) => { setHeard(txt); setScore(phraseSimilarity(txt, target.en)); setPhase('scored'); };
  const start = () => {
    setInterim(''); setHeard(''); setErrKind(''); setPhase('listening');
    let got = '';
    stopRef.current = recognizeOnce({
      lang: 'en-US',
      onInterim: (t) => setInterim(t),
      onResult: (t) => { got = t; },
      onError: (err) => { setErrKind(err); setPhase('error'); },
      onEnd: (t) => { const f = (t || got || '').trim(); if (f) finish(f); else { setErrKind((k) => k || 'no-speech'); setPhase((p) => (p === 'error' ? p : 'error')); } },
    });
  };
  const stopNow = () => { if (stopRef.current) stopRef.current(); };

  const ink = topicInk(hue);
  const ok = score >= 0.6, close = score >= 0.34;

  // phrase reminder card (with a "hear it first" button)
  const PhraseCard = () => (
    <div style={{ background: '#fff', borderRadius: 16, padding: '12px 16px', boxShadow: C.shSoft, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ font: `800 17px/1.2 ${C.round}`, color: C.ink }}>{target.en}</div>
        <div style={{ font: `600 12px ${C.round}`, color: C.dim, marginTop: 2 }}>{target.es}</div>
      </div>
      <button onClick={() => speak(target.en)} style={{ border: 'none', cursor: 'pointer', width: 36, height: 36, flex: '0 0 auto', borderRadius: '50%', background: topicSoft(hue), color: ink, fontSize: 15 }}>🔊</button>
    </div>
  );

  const SkipLink = ({ label }) => (
    <div style={{ textAlign: 'center', marginTop: 10 }}>
      <button onClick={() => onDone('', false)} style={{ border: 'none', background: 'none', cursor: 'pointer', font: `700 12px ${C.round}`, color: C.faint }}>{label}</button>
    </div>
  );

  const Header = () => (
    <div style={{ font: `800 11px ${C.round}`, letterSpacing: '1px', textTransform: 'uppercase', color: C.dim, marginBottom: 10 }}>🎤 Ahora dilo tú</div>
  );

  if (!available) {
    return (
      <div>
        <Header />
        <PhraseCard />
        <div style={{ font: `600 12.5px/1.45 ${C.round}`, color: C.dim, margin: '11px 2px 0' }}>
          La práctica de voz necesita micrófono. En la app instalada funciona sin internet, en tu teléfono.
        </div>
        <div style={{ marginTop: 12 }}><Pill kind="primary" hue={hue} full onClick={() => onDone('', false)}>Lo dije ✓ · Continuar</Pill></div>
      </div>
    );
  }

  if (phase === 'listening') {
    return (
      <div>
        <Header />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '6px 0 4px' }}>
          <div style={{ position: 'relative', width: 76, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: topicMid(hue), opacity: 0.25, animation: 'puentePulse 1.4s ease-out infinite' }} />
            <button onClick={stopNow} style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer', background: topicMid(hue), color: '#fff', fontSize: 26, boxShadow: C.sh }}>⏹</button>
          </div>
          <div style={{ font: `800 14px ${C.round}`, color: ink }}>Escuchando… di la frase</div>
          <div style={{ minHeight: 20, font: `600 14px ${C.round}`, color: C.dim, textAlign: 'center' }}>{interim || '“' + target.en + '”'}</div>
        </div>
      </div>
    );
  }

  if (phase === 'scored') {
    const tone = ok ? 155 : close ? 75 : 25;
    const verdict = ok ? '¡Muy bien! Te entendí perfecto.' : close ? 'Casi — vas muy bien.' : 'Te escuché diferente. Sin prisa, otra vez.';
    return (
      <div>
        <Header />
        <div style={{ background: topicSoft(tone), borderRadius: 16, padding: '13px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{ok ? '🌿' : close ? '👍' : '🔁'}</span>
            <span style={{ font: `800 14px ${C.round}`, color: topicInk(tone) }}>{verdict}</span>
          </div>
          <div style={{ font: `600 13px ${C.round}`, color: C.dim, marginTop: 7 }}>Te escuché: <span style={{ color: C.ink, fontWeight: 800 }}>“{heard}”</span></div>
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 11 }}>
          <Pill kind="soft" hue={hue} onClick={start} style={{ flex: 1 }}>↺ Otra vez</Pill>
          <Pill kind="primary" hue={hue} onClick={() => onDone(heard, ok)} style={{ flex: 1.5 }}>Continuar →</Pill>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    const msg = errKind === 'not-allowed' || errKind === 'service-not-allowed'
      ? 'Necesito permiso del micrófono para escucharte. Puedes activarlo, o continuar.'
      : 'No te alcancé a escuchar. Acércate y prueba otra vez, sin prisa.';
    return (
      <div>
        <Header />
        <PhraseCard />
        <div style={{ font: `600 12.5px/1.45 ${C.round}`, color: C.dim, margin: '11px 2px 0' }}>{msg}</div>
        <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
          <Pill kind="soft" hue={hue} onClick={start} style={{ flex: 1 }}>↺ Intentar</Pill>
          <Pill kind="primary" hue={hue} onClick={() => onDone('', false)} style={{ flex: 1.2 }}>Continuar →</Pill>
        </div>
      </div>
    );
  }

  // idle
  return (
    <div>
      <Header />
      <PhraseCard />
      <div style={{ marginTop: 12 }}>
        <Pill kind="primary" hue={hue} full onClick={start}>🎤 Tócame y dilo en voz alta</Pill>
      </div>
      <SkipLink label="Saltar por ahora" />
    </div>
  );
}

Object.assign(window, { SpeakPractice });
