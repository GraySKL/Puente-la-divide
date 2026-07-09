// directionC.jsx — "Aliento": soft, calm, rounded, airy, friendly guide.
(function () {
  const BG = '#fbfaf7', INK = '#2c2824', DIM = 'rgba(44,40,36,0.55)';
  const round = '"Nunito", system-ui';
  const SH = '0 8px 24px -10px rgba(60,50,40,0.22)';
  const Screen = ({ children, bg = BG }) => <div style={{ flex: 1, background: bg, display: 'flex', flexDirection: 'column', minHeight: 0 }}>{children}</div>;
  const Pad = ({ children, style }) => <div style={{ padding: '0 22px', ...style }}>{children}</div>;

  // ---- HOME ----
  function CHome() {
    const cont = TOPICS.parada;
    const tiles = ['clinica', 'trabajo', 'casa', 'escuela'];
    return (
      <PhoneFrame dark={false} bg={BG}>
        <Screen>
          <Pad style={{ paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: `800 16px ${round}`, color: INK }}>Puente</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: `700 11px ${round}`, color: topicInk(155), background: topicSoft(155), padding: '5px 11px', borderRadius: 999 }}>
              <i style={{ width: 6, height: 6, borderRadius: 9, background: topicMid(155) }} /> Sin red
            </span>
          </Pad>

          <Pad style={{ paddingTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <Guia size={52} ink={INK} ring="rgba(0,0,0,0.1)" label="Tía" />
              <div>
                <div style={{ font: `700 14px ${round}`, color: DIM }}>Buenos días,</div>
                <div style={{ font: `800 26px/1 ${round}`, color: INK }}>Rosa 👋</div>
              </div>
            </div>
          </Pad>

          <Pad style={{ paddingTop: 20 }}>
            <div style={{ borderRadius: 22, background: topicSoft(cont.hue), border: `1px solid ${topicEdge(cont.hue)}`, padding: '18px 20px', boxShadow: SH }}>
              <div style={{ font: `800 11px ${round}`, letterSpacing: '1.2px', textTransform: 'uppercase', color: topicInk(cont.hue) }}>Seguir · {cont.es}</div>
              <div style={{ font: `800 21px/1.15 ${round}`, color: INK, marginTop: 6 }}>Cuando te piden la licencia</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                <div style={{ flex: 1, height: 9, borderRadius: 6, background: '#fff' }}>
                  <div style={{ width: '55%', height: '100%', borderRadius: 6, background: topicMid(cont.hue) }} />
                </div>
                <span style={{ font: `800 13px ${round}`, color: topicInk(cont.hue) }}>3/6</span>
              </div>
            </div>
          </Pad>

          <Pad style={{ paddingTop: 24 }}>
            <div style={{ font: `800 12px ${round}`, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(44,40,36,0.4)', marginBottom: 13 }}>¿Qué quieres practicar?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {tiles.map((k) => {
                const t = TOPICS[k];
                return (
                  <div key={k} style={{ borderRadius: 20, background: '#fff', boxShadow: SH, padding: '15px 16px 17px' }}>
                    <span style={{ width: 42, height: 42, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', background: topicSoft(t.hue), color: topicInk(t.hue), font: `400 21px ${round}` }}>{t.glyph}</span>
                    <div style={{ font: `800 17px/1.1 ${round}`, color: INK, marginTop: 11 }}>{t.es}</div>
                    <div style={{ font: `600 11px ${round}`, color: DIM, marginTop: 2 }}>{t.en}</div>
                  </div>
                );
              })}
            </div>
          </Pad>

          <div style={{ flex: 1 }} />
          <div style={{ padding: '12px 22px 10px', display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '15px', borderRadius: 16, background: '#fff', boxShadow: SH, font: `800 14px ${round}`, color: INK }}>Frases</div>
            <div style={{ flex: 1.4, textAlign: 'center', padding: '15px', borderRadius: 16, background: INK, color: '#fff', font: `800 14px ${round}` }}>★ Mis derechos</div>
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  // ---- CONVERSATION ----
  function CConversation() {
    const t = TOPICS.parada, ink = topicInk(t.hue);
    return (
      <PhoneFrame dark={false} bg={topicSoft(t.hue)}>
        <Screen bg={topicSoft(t.hue)}>
          <Pad style={{ paddingTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: `800 20px ${round}`, color: ink }}>‹</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ font: `800 13px ${round}`, color: ink }}>{t.es}</div>
              <div style={{ font: `700 10px ${round}`, color: DIM, letterSpacing: '0.5px' }}>LECCIÓN 3</div>
            </div>
            <span style={{ font: `700 12px ${round}`, color: ink, background: '#fff', borderRadius: 999, padding: '6px 12px', boxShadow: SH }}>Salir</span>
          </Pad>
          <div style={{ height: 8, margin: '14px 22px 0', borderRadius: 6, background: '#fff' }}>
            <div style={{ width: '40%', height: '100%', borderRadius: 6, background: topicMid(t.hue) }} />
          </div>

          <Pad style={{ paddingTop: 18 }}>
            <div style={{ textAlign: 'center', font: `700 13px/1.4 ${round}`, color: DIM, padding: '0 10px' }}>Un oficial se acerca a tu ventana 🚗</div>
          </Pad>

          {/* officer bubble */}
          <Pad style={{ paddingTop: 16 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ width: 38, height: 38, flex: '0 0 auto', borderRadius: '50%', background: '#fff', boxShadow: SH, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `800 10px ${round}`, color: ink }}>OF</span>
              <div style={{ background: '#fff', borderRadius: '6px 22px 22px 22px', padding: '15px 18px', boxShadow: SH }}>
                <div style={{ font: `800 19px/1.3 ${round}`, color: INK }}>“License and registration, please.”</div>
                <div style={{ font: `600 14px ${round}`, color: DIM, marginTop: 6 }}>Licencia y registración, por favor.</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 11, font: `800 13px ${round}`, color: ink }}>▶ Escuchar</div>
              </div>
            </div>
          </Pad>

          {/* guide right note */}
          <Pad style={{ paddingTop: 13 }}>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <div style={{ background: topicMid(t.hue), color: '#fff', borderRadius: '22px 22px 6px 22px', padding: '14px 17px', maxWidth: 270, boxShadow: SH }}>
                <div style={{ font: `800 10px ${round}`, letterSpacing: '1.2px', textTransform: 'uppercase', opacity: 0.85, marginBottom: 5 }}>💡 Tu derecho</div>
                <div style={{ font: `600 14.5px/1.45 ${round}` }}>No tienes que decir de dónde eres. Puedes decir: “I want to remain silent.”</div>
              </div>
              <Guia size={38} ink={'#fff'} ring="rgba(255,255,255,0.4)" label="Tía" />
            </div>
          </Pad>

          <div style={{ flex: 1 }} />
          <div style={{ padding: '14px 22px 10px' }}>
            <div style={{ font: `800 11px ${round}`, letterSpacing: '1px', textTransform: 'uppercase', color: DIM, marginBottom: 10 }}>Tu turno — toca para decir</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Here you are, officer.', 'Aquí tiene.', false],
                ['Am I free to go?', '¿Puedo irme?', true],
                ['I want to remain silent.', 'Quiero guardar silencio.', false]].map(([en, es, hot]) => (
                <div key={en} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 17px', borderRadius: 18, background: hot ? topicMid(t.hue) : '#fff', boxShadow: SH }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: `800 16px ${round}`, color: hot ? '#fff' : INK }}>{en}</div>
                    <div style={{ font: `600 12px ${round}`, color: hot ? 'rgba(255,255,255,0.8)' : DIM, marginTop: 1 }}>{es}</div>
                  </div>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: hot ? 'rgba(255,255,255,0.25)' : topicSoft(t.hue), color: hot ? '#fff' : ink, font: '13px' }}>▶</span>
                </div>
              ))}
            </div>
          </div>
        </Screen>
      </PhoneFrame>
    );
  }

  // ---- RIGHTS CARD ----
  function CRights() {
    const t = TOPICS.parada, ink = topicInk(t.hue);
    return (
      <PhoneFrame dark={false} bg={topicSoft(t.hue)}>
        <Screen bg={topicSoft(t.hue)}>
          <Pad style={{ paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: `800 12px ${round}`, letterSpacing: '1px', textTransform: 'uppercase', color: ink }}>Tarjeta de derechos</span>
            <span style={{ font: `700 13px ${round}`, color: ink, background: '#fff', borderRadius: 999, padding: '6px 13px', boxShadow: SH }}>Cerrar</span>
          </Pad>
          <Pad style={{ paddingTop: 18 }}>
            <div style={{ font: `800 25px/1.15 ${round}`, color: INK }}>Respira. Puedes mostrar esto.</div>
            <div style={{ font: `600 14px/1.4 ${round}`, color: DIM, marginTop: 8 }}>Show or read this card. You are safe to stay silent.</div>
          </Pad>
          <Pad style={{ paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['I want to remain silent.', 'Quiero guardar silencio.'],
              ['I do not consent to a search.', 'No consiento una revisión.'],
              ['Am I free to go?', '¿Puedo irme?']].map(([en, es]) => (
              <div key={en} style={{ background: '#fff', borderRadius: 20, padding: '17px 19px', boxShadow: SH }}>
                <div style={{ font: `800 21px/1.2 ${round}`, color: INK }}>{en}</div>
                <div style={{ font: `600 15px ${round}`, color: DIM, marginTop: 6 }}>{es}</div>
              </div>
            ))}
          </Pad>
          <div style={{ flex: 1 }} />
          <Pad style={{ paddingBottom: 8 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '16px', borderRadius: 18, background: topicMid(t.hue), color: '#fff', font: `800 15px ${round}` }}>🔊 Leer en voz alta</div>
              <div style={{ flex: '0 0 auto', textAlign: 'center', padding: '16px 18px', borderRadius: 18, background: '#fff', boxShadow: SH, font: `800 15px ${round}`, color: ink }}>Aa</div>
            </div>
            <div style={{ textAlign: 'center', font: `700 10px ${round}`, letterSpacing: '1px', textTransform: 'uppercase', color: DIM, marginTop: 12 }}>Funciona sin internet 💛</div>
          </Pad>
        </Screen>
      </PhoneFrame>
    );
  }

  Object.assign(window, { CHome, CConversation, CRights });
})();
