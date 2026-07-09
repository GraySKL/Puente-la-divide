// directionB.jsx — "Señal": bold wayfinding clarity, full-bleed topic color, huge type.
(function () {
  const CREAM = '#f6f2ea', INK = '#1d1a16';
  const disp = '"Archivo", system-ui', sans = '"Hanken Grotesk", system-ui';
  const Screen = ({ children, bg }) => <div style={{ flex: 1, background: bg, display: 'flex', flexDirection: 'column', minHeight: 0 }}>{children}</div>;

  // ---- HOME ----
  function BHome() {
    const cont = TOPICS.parada;
    const grid = ['clinica', 'trabajo', 'casa', 'escuela'];
    return (
      <PhoneFrame dark={false} bg={CREAM}>
        <Screen bg={CREAM}>
          <div style={{ padding: '8px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: `800 14px ${disp}`, letterSpacing: '-0.2px', color: INK, textTransform: 'uppercase' }}>Puente</span>
            <span style={{ font: `700 10px ${sans}`, letterSpacing: '1px', color: '#fff', background: topicMid(155), padding: '4px 9px', borderRadius: 6, textTransform: 'uppercase' }}>● Offline</span>
          </div>

          <div style={{ padding: '18px 20px 0' }}>
            <div style={{ font: `700 13px ${sans}`, letterSpacing: '0.5px', color: 'rgba(29,26,22,0.5)', textTransform: 'uppercase' }}>Martes</div>
            <div style={{ font: `800 40px/0.95 ${disp}`, letterSpacing: '-1px', color: INK, marginTop: 4 }}>HOLA,<br />ROSA.</div>
          </div>

          {/* continue — full bleed color */}
          <div style={{ margin: '20px 20px 0', borderRadius: 18, background: topicMid(cont.hue), padding: '20px 22px', color: '#fff' }}>
            <div style={{ font: `700 11px ${sans}`, letterSpacing: '1.6px', textTransform: 'uppercase', opacity: 0.85 }}>Seguir · {cont.es}</div>
            <div style={{ font: `800 24px/1.05 ${disp}`, letterSpacing: '-0.5px', marginTop: 8 }}>Cuando te piden la licencia</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
              <div style={{ flex: 1, height: 8, borderRadius: 5, background: 'rgba(255,255,255,0.3)' }}>
                <div style={{ width: '55%', height: '100%', borderRadius: 5, background: '#fff' }} />
              </div>
              <span style={{ font: `800 13px ${disp}`, letterSpacing: '0.3px' }}>3 / 6</span>
            </div>
          </div>

          {/* topic grid */}
          <div style={{ padding: '22px 20px 0' }}>
            <div style={{ font: `700 11px ${sans}`, letterSpacing: '1.6px', textTransform: 'uppercase', color: 'rgba(29,26,22,0.45)', marginBottom: 12 }}>Situaciones</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
              {grid.map((k) => {
                const t = TOPICS[k];
                return (
                  <div key={k} style={{ borderRadius: 16, background: topicMid(t.hue), color: '#fff', padding: '16px 16px 18px', minHeight: 96, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <span style={{ font: `400 26px ${disp}` }}>{t.glyph}</span>
                    <div>
                      <div style={{ font: `800 19px/1 ${disp}`, letterSpacing: '-0.3px' }}>{t.es}</div>
                      <div style={{ font: `700 11px ${sans}`, opacity: 0.85, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.en}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ padding: '12px 20px 10px' }}>
            <div style={{ background: INK, color: '#fff', borderRadius: 14, padding: '17px', textAlign: 'center', font: `800 17px ${disp}`, letterSpacing: '0.3px' }}>★ MIS DERECHOS</div>
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  // ---- CONVERSATION — full bleed topic color ----
  function BConversation() {
    const t = TOPICS.parada, bg = topicMid(t.hue);
    return (
      <PhoneFrame dark bg={topicInk(t.hue)} bezel="#0f0c0a">
        <Screen bg={topicInk(t.hue)}>
          <div style={{ padding: '6px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
            <span style={{ font: `800 18px ${disp}` }}>‹</span>
            <span style={{ font: `800 12px ${disp}`, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{t.es}</span>
            <span style={{ font: `700 11px ${sans}`, padding: '5px 11px', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.4)' }}>SALIR ✕</span>
          </div>
          <div style={{ height: 6, margin: '12px 20px 0', borderRadius: 4, background: 'rgba(255,255,255,0.25)' }}>
            <div style={{ width: '40%', height: '100%', borderRadius: 4, background: '#fff' }} />
          </div>

          <div style={{ padding: '20px 22px 0' }}>
            <div style={{ font: `700 11px ${sans}`, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>El oficial dice</div>
            <div style={{ font: `800 30px/1.1 ${disp}`, letterSpacing: '-0.6px', color: '#fff', marginTop: 10 }}>“License and registration, please.”</div>
            <div style={{ font: `500 16px/1.35 ${sans}`, color: 'rgba(255,255,255,0.72)', marginTop: 12 }}>Licencia y registración, por favor.</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '9px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.16)', font: `700 13px ${sans}`, color: '#fff' }}>▶ Escuchar</div>
          </div>

          {/* right note */}
          <div style={{ margin: '20px 20px 0', background: '#fff', borderRadius: 16, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Guia size={30} ink={topicInk(t.hue)} ring={topicEdge(t.hue)} label="Tía" />
              <span style={{ font: `800 11px ${sans}`, letterSpacing: '1.4px', textTransform: 'uppercase', color: topicInk(t.hue) }}>Tu derecho</span>
            </div>
            <div style={{ font: `600 16px/1.4 ${sans}`, color: INK }}>No tienes que decir de dónde eres. Puedes decir: <span style={{ color: topicInk(t.hue) }}>“I want to remain silent.”</span></div>
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ padding: '14px 20px 8px' }}>
            <div style={{ font: `700 11px ${sans}`, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Tu turno</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[['Here you are, officer.', 'Aquí tiene.'],
                ['Am I free to go?', '¿Puedo irme?'],
                ['I want to remain silent.', 'Quiero guardar silencio.']].map(([en, es]) => (
                <div key={en} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 13, padding: '13px 16px' }}>
                  <div>
                    <div style={{ font: `800 16px/1.15 ${disp}`, letterSpacing: '-0.2px', color: INK }}>{en}</div>
                    <div style={{ font: `500 12px ${sans}`, color: 'rgba(29,26,22,0.55)', marginTop: 3 }}>{es}</div>
                  </div>
                  <span style={{ font: `400 16px ${disp}`, color: topicInk(t.hue) }}>▶</span>
                </div>
              ))}
            </div>
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  // ---- RIGHTS CARD ----
  function BRights() {
    const t = TOPICS.parada;
    return (
      <PhoneFrame dark bg={INK} bezel="#0f0c0a">
        <Screen bg={INK}>
          <div style={{ padding: '8px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: `800 12px ${disp}`, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Derechos</span>
            <span style={{ font: `700 11px ${sans}`, color: 'rgba(255,255,255,0.8)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 999, padding: '5px 11px' }}>✕</span>
          </div>
          <div style={{ padding: '20px 22px 0' }}>
            <div style={{ font: `800 30px/0.98 ${disp}`, letterSpacing: '-0.8px', color: '#fff' }}>MUESTRE<br />ESTA CARTA.</div>
            <div style={{ font: `500 14px ${sans}`, color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>Show this card to the officer.</div>
          </div>
          <div style={{ padding: '22px 20px 0', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {[['I want to remain silent.', 'Quiero guardar silencio.'],
              ['I do not consent to a search.', 'No consiento una revisión.'],
              ['Am I free to go?', '¿Puedo irme?']].map(([en, es]) => (
              <div key={en} style={{ background: '#fff', borderRadius: 16, padding: '16px 18px' }}>
                <div style={{ font: `800 22px/1.05 ${disp}`, letterSpacing: '-0.4px', color: INK }}>{en}</div>
                <div style={{ font: `600 15px ${sans}`, color: 'rgba(29,26,22,0.55)', marginTop: 6 }}>{es}</div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ padding: '12px 20px 10px' }}>
            <div style={{ background: topicMid(t.hue), color: '#fff', borderRadius: 14, padding: '17px', textAlign: 'center', font: `800 18px ${disp}`, letterSpacing: '0.3px' }}>🔊 LEER EN VOZ ALTA</div>
            <div style={{ textAlign: 'center', font: `700 10px ${sans}`, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 12 }}>Funciona sin internet</div>
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  Object.assign(window, { BHome, BConversation, BRights });
})();
