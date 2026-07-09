// pweb.jsx — the marketing / download website that frames and launches the app.
function WebNav({ onTry }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 4, background: 'rgba(251,250,247,0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(44,40,36,0.07)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: topicMid(250), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', font: `800 15px ${C.round}` }}>P</span>
        <span style={{ font: `800 18px ${C.round}`, color: C.ink }}>Puente <span style={{ color: C.dim }}>la Divide</span></span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          {['Cómo funciona', 'Situaciones', 'Descargar'].map((l) => <span key={l} style={{ font: `700 14px ${C.round}`, color: C.dim, cursor: 'pointer' }}>{l}</span>)}
          <button onClick={onTry} style={{ border: 'none', cursor: 'pointer', background: C.ink, color: '#fff', borderRadius: 12, padding: '10px 16px', font: `800 13px ${C.round}` }}>Probar ahora</button>
        </div>
      </div>
    </div>
  );
}

function Website({ onTry, onDownload }) {
  const pillRow = (items) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
      {items.map(([ic, l, sub], i) => (
        <button key={i} onClick={i === items.length - 1 ? onTry : onDownload} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, background: i === items.length - 1 ? 'transparent' : '#fff', boxShadow: i === items.length - 1 ? 'inset 0 0 0 1.5px rgba(44,40,36,0.2)' : C.sh, borderRadius: 14, padding: '12px 18px' }}>
          <span style={{ fontSize: 22 }}>{ic}</span>
          <span style={{ textAlign: 'left' }}>
            <span style={{ display: 'block', font: `700 10px ${C.round}`, color: C.dim }}>{sub}</span>
            <span style={{ display: 'block', font: `800 14px ${C.round}`, color: C.ink }}>{l}</span>
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: C.bg }}>
      <WebNav onTry={onTry} />

      {/* HERO */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '60px 28px 40px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: topicSoft(75), color: topicInk(75), borderRadius: 999, padding: '7px 14px', font: `800 12px ${C.round}` }}>💛 Gratis, para siempre</div>
          <h1 style={{ font: `800 52px/1.05 ${C.round}`, color: C.ink, letterSpacing: '-1px', margin: '18px 0 0' }}>Aprende el inglés que de verdad necesitas.</h1>
          <p style={{ font: `italic 500 21px/1.4 "Newsreader", serif`, color: C.dim, margin: '16px 0 0', maxWidth: 460 }}>Y conoce tus derechos en cada paso del camino — practicando con una guía, no con un libro.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <Pill kind="primary" hue={250} onClick={onTry}>Probar en el navegador →</Pill>
            <Pill kind="ghost" hue={250} onClick={onDownload}>Descargar gratis</Pill>
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 22, font: `700 13px ${C.round}`, color: C.dim }}>
            <span>✓ Sin cuenta</span><span>✓ Sin internet</span><span>✓ Modo discreto</span>
          </div>
        </div>
        {/* live phone */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 393 * 0.66, height: 852 * 0.66, position: 'relative' }}>
            <div style={{ transform: 'scale(0.66)', transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}><PhoneApp /></div>
          </div>
        </div>
      </div>

      {/* HOW */}
      <div style={{ background: '#fff', borderTop: '1px solid rgba(44,40,36,0.07)', borderBottom: '1px solid rgba(44,40,36,0.07)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '54px 28px' }}>
          <div style={{ textAlign: 'center', font: `800 12px ${C.round}`, letterSpacing: '1.4px', textTransform: 'uppercase', color: C.faint }}>Cómo funciona</div>
          <h2 style={{ textAlign: 'center', font: `800 34px ${C.round}`, color: C.ink, margin: '10px 0 36px' }}>Una conversación a la vez</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {[['🗣️', 'Vive la situación', 'Una parada de tráfico, una clínica, el trabajo. Escenas reales, no listas de palabras.'],
              ['💬', 'Elige qué decir', 'Escucha el inglés, ve el español, y practica tu respuesta en voz alta.'],
              ['🛡️', 'Conoce tu derecho', 'Tía Marisol te recuerda lo que puedes decir —y callar— justo cuando importa.']].map(([ic, t, d]) => (
              <div key={t} style={{ background: C.bg, borderRadius: 20, padding: '24px 22px' }}>
                <div style={{ fontSize: 34 }}>{ic}</div>
                <div style={{ font: `800 19px ${C.round}`, color: C.ink, marginTop: 12 }}>{t}</div>
                <div style={{ font: `600 14px/1.55 ${C.round}`, color: C.dim, marginTop: 8 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SITUATIONS — topic color band */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '54px 28px' }}>
        <h2 style={{ font: `800 30px ${C.round}`, color: C.ink, margin: '0 0 6px' }}>Para los momentos que importan</h2>
        <p style={{ font: `600 15px ${C.round}`, color: C.dim, margin: '0 0 26px' }}>Cada situación tiene su propio color y su propia guía.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {APP_TOPICS.map((k) => {
            const t = TOPICS[k];
            return (
              <div key={k} style={{ borderRadius: 18, overflow: 'hidden', boxShadow: C.sh }}>
                <div style={{ background: topicMid(t.hue), height: 80, display: 'flex', alignItems: 'center', padding: '0 20px', color: '#fff', fontSize: 30 }}>{t.glyph}</div>
                <div style={{ background: '#fff', padding: '14px 18px' }}>
                  <div style={{ font: `800 17px ${C.round}`, color: C.ink }}>{t.es} {LOCKED[k] && <span style={{ font: `700 11px ${C.round}`, color: C.faint }}>· pronto</span>}</div>
                  <div style={{ font: `600 12px ${C.round}`, color: C.dim, marginTop: 2 }}>{t.en} · {t.note}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DOWNLOAD */}
      <div style={{ background: topicSoft(250) }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 28px', textAlign: 'center' }}>
          <h2 style={{ font: `800 34px ${C.round}`, color: C.ink, margin: '0 0 8px' }}>Llévalo contigo</h2>
          <p style={{ font: `600 15px ${C.round}`, color: C.dim, margin: '0 0 26px' }}>Una vez descargado, funciona aunque te quedes sin señal.</p>
          {pillRow([['🍎', 'macOS', 'Descargar para'], ['🪟', 'Windows', 'Descargar para'], ['📱', 'iPhone', 'Descargar para'], ['🤖', 'Android', 'Descargar para'], ['🌐', 'Navegador', 'Abrir en el']])}
          <div style={{ marginTop: 26, font: `600 13px/1.6 ${C.round}`, color: C.dim, maxWidth: 560, margin: '26px auto 0' }}>
            El contenido de derechos es educativo y se revisa junto a organizaciones legales de inmigración. Puente no da asesoría legal.
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '30px 28px 50px', display: 'flex', alignItems: 'center', gap: 12, color: C.faint }}>
        <span style={{ font: `800 14px ${C.round}`, color: C.dim }}>Puente la Divide</span>
        <span style={{ font: `600 13px ${C.round}` }}>— bridge the divide</span>
        <div style={{ flex: 1 }} />
        <span style={{ font: `600 13px ${C.round}` }}>Hecho con cuidado, para cualquiera que llega.</span>
      </div>
    </div>
  );
}

Object.assign(window, { Website });
