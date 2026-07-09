// directionA.jsx — "Cartilla": warm paper, editorial serif, trusted-booklet feel.
(function () {
  const PAPER = '#f1e9dc', CARD = '#fbf6ed', INK = '#2a241d', DIM = 'rgba(42,36,29,0.6)';
  const LINE = 'rgba(42,36,29,0.14)';
  const serif = '"Newsreader", serif', sans = '"Hanken Grotesk", system-ui';

  const Screen = ({ children, bg = PAPER }) => (
    <div style={{ flex: 1, background: bg, display: 'flex', flexDirection: 'column', minHeight: 0 }}>{children}</div>
  );
  const Pad = ({ children, style }) => <div style={{ padding: '0 22px', ...style }}>{children}</div>;

  // ---- HOME ----
  function AHome() {
    const cont = TOPICS.parada;
    const tiles = ['clinica', 'trabajo', 'casa', 'escuela'];
    return (
      <PhoneFrame dark={false} bg={PAPER}>
        <Screen>
          <Pad style={{ paddingTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: `600 15px ${serif}`, color: INK, letterSpacing: '0.2px' }}>Puente <span style={{ fontStyle: 'italic', color: DIM }}>la Divide</span></span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: `600 10px ${sans}`, letterSpacing: '1px', color: DIM, textTransform: 'uppercase' }}>
              <i style={{ width: 6, height: 6, borderRadius: 9, background: topicMid(155) }} /> Sin red · listo
            </span>
          </Pad>

          <Pad style={{ paddingTop: 22 }}>
            <div style={{ font: `400 13px ${sans}`, color: DIM, letterSpacing: '0.3px' }}>Martes · 7 de mayo</div>
            <div style={{ font: `600 30px/1.1 ${serif}`, color: INK, letterSpacing: '-0.4px', marginTop: 4 }}>Buenos días, Rosa.</div>
          </Pad>

          {/* continue card */}
          <Pad style={{ paddingTop: 20 }}>
            <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ height: 5, background: topicMid(cont.hue) }} />
              <div style={{ padding: '16px 18px' }}>
                <div style={{ font: `600 11px ${sans}`, letterSpacing: '1.4px', textTransform: 'uppercase', color: topicInk(cont.hue) }}>Continuar · {cont.es}</div>
                <div style={{ font: `600 20px/1.2 ${serif}`, color: INK, marginTop: 5 }}>Cuando te piden la licencia</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 4, background: topicSoft(cont.hue), border: `1px solid ${topicEdge(cont.hue)}`, overflow: 'hidden' }}>
                    <div style={{ width: '55%', height: '100%', background: topicMid(cont.hue) }} />
                  </div>
                  <span style={{ font: `600 12px ${sans}`, color: DIM }}>Lección 3 de 6</span>
                </div>
              </div>
            </div>
          </Pad>

          {/* topic list */}
          <Pad style={{ paddingTop: 24 }}>
            <div style={{ font: `600 11px ${sans}`, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(42,36,29,0.42)', marginBottom: 12 }}>Aprende por situación</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {tiles.map((k) => {
                const t = TOPICS[k];
                return (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 14, background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, padding: '12px 16px' }}>
                    <span style={{ width: 38, height: 38, borderRadius: 9, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: topicSoft(t.hue), color: topicInk(t.hue), border: `1px solid ${topicEdge(t.hue)}`, font: `400 18px ${serif}` }}>{t.glyph}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: `600 16px/1.1 ${serif}`, color: INK }}>{t.es}</div>
                      <div style={{ font: `400 12px ${sans}`, color: DIM, marginTop: 1 }}>{t.en} · {t.note}</div>
                    </div>
                    <span style={{ color: 'rgba(42,36,29,0.3)', font: `400 18px ${serif}` }}>›</span>
                  </div>
                );
              })}
            </div>
          </Pad>

          <div style={{ flex: 1 }} />
          {/* tab bar */}
          <div style={{ borderTop: `1px solid ${LINE}`, background: CARD, padding: '11px 22px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {[['Hoy', true], ['Practicar', false], ['Frases', false]].map(([l, on]) => (
              <span key={l} style={{ font: `${on ? 600 : 400} 13px ${sans}`, color: on ? INK : DIM, borderBottom: on ? `2px solid ${topicMid(cont.hue)}` : '2px solid transparent', paddingBottom: 5 }}>{l}</span>
            ))}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 999, border: `1.5px solid ${INK}`, font: `600 13px ${sans}`, color: INK }}>★ Mis derechos</span>
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  // ---- CONVERSATION (La parada) ----
  function AConversation() {
    const t = TOPICS.parada, ink = topicInk(t.hue);
    return (
      <PhoneFrame dark={false} bg={PAPER}>
        <Screen>
          <Pad style={{ paddingTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: `400 19px ${serif}`, color: INK }}>‹</span>
            <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
              <div style={{ font: `600 10px ${sans}`, letterSpacing: '1.4px', textTransform: 'uppercase', color: ink }}>{t.es}</div>
              <div style={{ font: `400 11px ${sans}`, color: DIM, marginTop: 3 }}>Lección 3</div>
            </div>
            <span style={{ font: `600 11px ${sans}`, color: DIM, border: `1px solid ${LINE}`, borderRadius: 999, padding: '4px 10px' }}>Salir ✕</span>
          </Pad>

          <div style={{ height: 4, margin: '12px 22px 0', borderRadius: 3, background: topicSoft(t.hue) }}>
            <div style={{ width: '40%', height: '100%', borderRadius: 3, background: topicMid(t.hue) }} />
          </div>

          <Pad style={{ paddingTop: 18 }}>
            <div style={{ font: `italic 400 15px/1.4 ${serif}`, color: DIM }}>La escena</div>
            <div style={{ font: `400 18px/1.35 ${serif}`, color: INK, marginTop: 2 }}>Un oficial te detiene mientras conduces y se acerca a tu ventana.</div>
          </Pad>

          {/* officer line */}
          <Pad style={{ paddingTop: 18 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ width: 40, height: 40, flex: '0 0 auto', borderRadius: '50%', background: topicSoft(t.hue), border: `1px solid ${topicEdge(t.hue)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `600 10px ${sans}`, color: ink, textTransform: 'uppercase' }}>Of.</span>
              <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: '4px 16px 16px 16px', padding: '13px 16px' }}>
                <div style={{ font: `600 18px/1.3 ${sans}`, color: INK }}>“License and registration, please.”</div>
                <div style={{ font: `italic 400 14px/1.3 ${serif}`, color: DIM, marginTop: 5 }}>Licencia y registración, por favor.</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, font: `600 12px ${sans}`, color: ink }}>▶ Escuchar otra vez</div>
              </div>
            </div>
          </Pad>

          {/* guide note — rights woven in */}
          <Pad style={{ paddingTop: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Guia size={40} ink={INK} ring={LINE} label="Tía" />
              <div style={{ background: topicSoft(t.hue), border: `1px solid ${topicEdge(t.hue)}`, borderRadius: '16px 16px 16px 4px', padding: '12px 15px' }}>
                <div style={{ font: `600 10px ${sans}`, letterSpacing: '1.2px', textTransform: 'uppercase', color: ink, marginBottom: 5 }}>Tu derecho</div>
                <div style={{ font: `400 14.5px/1.5 ${sans}`, color: INK }}>Entrega tus documentos con calma. No tienes que responder de dónde eres. Puedes decir: <b>“I want to remain silent.”</b></div>
              </div>
            </div>
          </Pad>

          <div style={{ flex: 1 }} />

          {/* your turn */}
          <div style={{ background: CARD, borderTop: `1px solid ${LINE}`, padding: '14px 22px 8px' }}>
            <div style={{ font: `600 11px ${sans}`, letterSpacing: '1.3px', textTransform: 'uppercase', color: 'rgba(42,36,29,0.45)', marginBottom: 10 }}>Tu turno · elige qué decir</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[['Here you are, officer.', 'Aquí tiene, oficial.', false],
                ['Am I free to go?', '¿Puedo irme?', true],
                ['I want to remain silent.', 'Quiero guardar silencio.', false]].map(([en, es, hot]) => (
                <div key={en} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 15px', borderRadius: 12, background: hot ? topicSoft(t.hue) : '#fff', border: `1.5px solid ${hot ? topicMid(t.hue) : LINE}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: `600 16px/1.2 ${sans}`, color: INK }}>{en}</div>
                    <div style={{ font: `italic 400 13px ${serif}`, color: DIM, marginTop: 1 }}>{es}</div>
                  </div>
                  <span style={{ font: `400 16px ${serif}`, color: ink }}>▶</span>
                </div>
              ))}
            </div>
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  // ---- RIGHTS CARD ----
  function ARights() {
    const t = TOPICS.parada, ink = topicInk(t.hue);
    return (
      <PhoneFrame dark={false} bg={INK} bezel="#0f0c0a">
        <Screen bg={INK}>
          <Pad style={{ paddingTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: `600 11px ${sans}`, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Tarjeta de derechos</span>
            <span style={{ font: `600 11px ${sans}`, color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '4px 10px' }}>Cerrar ✕</span>
          </Pad>

          <Pad style={{ paddingTop: 18 }}>
            <div style={{ font: `600 26px/1.15 ${serif}`, color: '#fff', letterSpacing: '-0.3px' }}>Puede mostrar o leer esto en voz alta.</div>
            <div style={{ font: `400 14px/1.4 ${sans}`, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>Show this card. You can read it to the officer.</div>
          </Pad>

          <Pad style={{ paddingTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['I do not wish to answer questions.', 'No deseo responder preguntas.'],
              ['I want to remain silent.', 'Quiero guardar silencio.'],
              ['I do not consent to a search.', 'No doy mi consentimiento para una revisión.'],
              ['Am I free to go?', '¿Puedo irme?']].map(([en, es]) => (
              <div key={en} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14, padding: '15px 18px' }}>
                <div style={{ font: `600 21px/1.25 ${sans}`, color: '#fff' }}>{en}</div>
                <div style={{ font: `italic 400 15px/1.3 ${serif}`, color: 'rgba(255,255,255,0.62)', marginTop: 6 }}>{es}</div>
              </div>
            ))}
          </Pad>

          <div style={{ flex: 1 }} />
          <Pad style={{ paddingBottom: 6 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '14px', borderRadius: 12, background: '#fff', font: `600 15px ${sans}`, color: INK }}>🔊 Leer en voz alta</div>
              <div style={{ flex: '0 0 auto', textAlign: 'center', padding: '14px 18px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.3)', font: `600 15px ${sans}`, color: '#fff' }}>Aa Grande</div>
            </div>
            <div style={{ textAlign: 'center', font: `600 10px ${sans}`, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 12 }}>Funciona sin internet</div>
          </Pad>
        </Screen>
      </PhoneFrame>
    );
  }

  Object.assign(window, { AHome, AConversation, ARights });
})();
