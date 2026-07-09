// src/app/screens.tsx — Onboarding, Home, RightsCard, Phrasebook, ComingSoon, DiscreetCover.
// Ported from Claude Design/pscreens.jsx (Preact + TS).
import { useEffect, useState } from 'preact/hooks';
import {
  APP_TOPICS, DISCLAIMER_EN, DISCLAIMER_ES, LOCKED, ONBOARDING, PHRASES, PREPARE_HUE, PREP_ITEMS, RIGHTS, TOPICS, type TopicKey,
} from './data';
import { C, Glyph, Guia, Pill, ProgressBar, speak, speakEs, speakSeq, topicEdge, topicInk, topicMid, topicSoft } from './ui';

// ---------- ONBOARDING ----------
export function Onboarding({ onDone, wide }: { onDone: () => void; wide: boolean }) {
  const [i, setI] = useState(0);
  const total = ONBOARDING.length; // panels, then a final confirm = index === total
  const onConfirm = i === total;
  const p = ONBOARDING[i];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, padding: wide ? '40px 48px' : '20px 26px 26px' }}>
      <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', gap: 7, paddingTop: 6 }}>
        {Array.from({ length: total + 1 }).map((_, k) => (
          <span key={k} style={{ width: k === i ? 22 : 7, height: 7, borderRadius: 9, background: k === i ? topicMid(250) : 'rgba(44,40,36,0.16)', transition: 'all .25s' }} />
        ))}
      </div>
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
        {!onConfirm ? (
          <>
            <div style={{ fontSize: 76, lineHeight: 1 }}>{p.emoji}</div>
            <div style={{ font: `800 28px/1.15 ${C.round}`, color: C.ink, marginTop: 26 }}>{p.title}</div>
            <div style={{ font: `600 16px/1.55 ${C.round}`, color: C.dim, marginTop: 12 }}>{p.body}</div>
          </>
        ) : (
          <>
            <Guia size={80} ink={C.ink} ring="rgba(0,0,0,0.1)" label="Tía" />
            <div style={{ font: `800 26px/1.2 ${C.round}`, color: C.ink, marginTop: 22 }}>
              Soy Tía Marisol.
              <br />
              Vamos juntas.
            </div>
            <div style={{ font: `600 15px/1.5 ${C.round}`, color: C.dim, marginTop: 12, maxWidth: 300 }}>Confírmame esto y empezamos. No necesitas cuenta ni internet.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22, width: '100%', maxWidth: 300 }}>
              {['🗣️  Hablo español', '🎯  Quiero aprender inglés'].map((t) => (
                <div key={t} style={{ background: '#fff', boxShadow: C.sh, borderRadius: 16, padding: '14px 18px', font: `800 15px ${C.round}`, color: C.ink, textAlign: 'left' }}>
                  {t}
                </div>
              ))}
            </div>
            {/* Bilingual legal disclaimer — required visible before first use. */}
            <div style={{ font: `600 11px/1.5 ${C.round}`, color: C.faint, marginTop: 18, maxWidth: 300 }}>
              {DISCLAIMER_ES}
              <br />
              {DISCLAIMER_EN}
            </div>
          </>
        )}
      </div>
      <div style={{ flex: '0 0 auto', maxWidth: 420, width: '100%', margin: '0 auto' }}>
        <Pill kind={onConfirm ? 'primary' : 'dark'} hue={250} full onClick={() => (onConfirm ? onDone() : setI(i + 1))}>
          {onConfirm ? 'Comenzar 💛' : 'Siguiente'}
        </Pill>
        {!onConfirm && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button onClick={onDone} style={{ border: 'none', background: 'none', cursor: 'pointer', font: `700 13px ${C.round}`, color: C.faint }}>
              Saltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- HOME ----------
export function Home({
  onPick, completed, wide,
}: {
  onPick: (k: TopicKey) => void;
  completed: Record<string, boolean>;
  wide: boolean;
}) {
  const cont: TopicKey = 'parada';
  const t = TOPICS[cont];
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: C.bg }}>
      <div style={{ padding: wide ? '8px 8px 24px' : '8px 22px 20px', maxWidth: wide ? 760 : 'none', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, paddingTop: 8 }}>
          <Guia size={50} ink={C.ink} ring="rgba(0,0,0,0.1)" label="Tía" />
          <div style={{ flex: 1 }}>
            <div style={{ font: `700 14px ${C.round}`, color: C.dim }}>Buenos días,</div>
            <div style={{ font: `800 26px/1 ${C.round}`, color: C.ink }}>Rosa 👋</div>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: `700 11px ${C.round}`, color: topicInk(155), background: topicSoft(155), padding: '6px 11px', borderRadius: 999 }}>
            <i style={{ width: 6, height: 6, borderRadius: 9, background: topicMid(155) }} /> Sin red
          </span>
        </div>

        {/* continue */}
        <div
          onClick={() => onPick(cont)}
          style={{ cursor: 'pointer', marginTop: 20, borderRadius: 22, background: topicSoft(t.hue), border: `1px solid ${topicEdge(t.hue)}`, padding: '18px 20px', boxShadow: C.sh }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ font: `800 11px ${C.round}`, letterSpacing: '1.1px', textTransform: 'uppercase', color: topicInk(t.hue) }}>
              {completed[cont] ? 'Repasar' : 'Seguir'} · {t.es}
            </div>
            {completed[cont] && <span style={{ font: `800 11px ${C.round}`, color: topicInk(155) }}>✓ hecho</span>}
          </div>
          <div style={{ font: `800 21px/1.15 ${C.round}`, color: C.ink, marginTop: 6 }}>Cuando te piden la licencia</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <div style={{ flex: 1 }}>
              <ProgressBar value={completed[cont] ? 1 : 0.5} hue={t.hue} />
            </div>
            <span style={{ font: `800 13px ${C.round}`, color: topicInk(t.hue) }}>{completed[cont] ? '6/6' : '3/6'}</span>
          </div>
        </div>

        {/* topics */}
        <div style={{ font: `800 12px ${C.round}`, letterSpacing: '1px', textTransform: 'uppercase', color: C.faint, margin: '24px 0 13px' }}>¿Qué quieres practicar?</div>
        <div style={{ display: 'grid', gridTemplateColumns: wide ? '1fr 1fr 1fr' : '1fr 1fr', gap: 12 }}>
          {/* Locked topics stay hidden from the public build (owner decision
              2026-07-09) — they appear here automatically once unlocked. */}
          {APP_TOPICS.filter((k) => !LOCKED[k]).map((k) => {
            const tt = TOPICS[k];
            const locked = LOCKED[k];
            const done = completed[k];
            return (
              <div
                key={k}
                onClick={() => onPick(k)}
                style={{ cursor: 'pointer', position: 'relative', borderRadius: 20, background: '#fff', boxShadow: C.sh, padding: '15px 16px 17px', opacity: locked ? 0.72 : 1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Glyph topic={k} />
                  {locked ? <span style={{ fontSize: 13 }}>🔒</span> : done ? <span style={{ font: `800 11px ${C.round}`, color: topicInk(155) }}>✓</span> : null}
                </div>
                <div style={{ font: `800 17px/1.1 ${C.round}`, color: C.ink, marginTop: 11 }}>{tt.es}</div>
                <div style={{ font: `600 11px ${C.round}`, color: C.dim, marginTop: 2 }}>{locked ? 'Próximamente' : tt.en}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- RIGHTS CARD (quick access) ----------
export function RightsCard({ onClose, topic = 'parada' }: { onClose: () => void; topic?: TopicKey }) {
  const [big, setBig] = useState(false);
  const hue = TOPICS[topic].hue;
  const enSize = big ? 27 : 21;
  const esSize = big ? 18 : 15;
  const readAll = () => speakSeq(RIGHTS.map((r) => r.en));
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: topicSoft(hue) }}>
      <div style={{ flex: '0 0 auto', padding: '12px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ font: `800 12px ${C.round}`, letterSpacing: '1px', textTransform: 'uppercase', color: topicInk(hue) }}>Tarjeta de derechos</span>
        <button onClick={onClose} style={{ border: 'none', cursor: 'pointer', font: `700 13px ${C.round}`, color: topicInk(hue), background: '#fff', borderRadius: 999, padding: '7px 14px', boxShadow: C.shSoft }}>
          Cerrar
        </button>
      </div>
      <div style={{ flex: '0 0 auto', padding: '16px 22px 4px' }}>
        <div style={{ font: `800 24px/1.15 ${C.round}`, color: C.ink }}>Respira. Puedes mostrar esto.</div>
        <div style={{ font: `600 14px/1.45 ${C.round}`, color: C.dim, marginTop: 7 }}>Show or read this card. You are safe to stay silent.</div>
      </div>
      <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        {RIGHTS.map((r, i) => (
          <div key={i} onClick={() => speak(r.en)} style={{ cursor: 'pointer', background: '#fff', borderRadius: 18, padding: '15px 18px', boxShadow: C.sh }}>
            <div style={{ font: `800 ${enSize}px/1.2 ${C.round}`, color: C.ink }}>{r.en}</div>
            <div style={{ font: `600 ${esSize}px ${C.round}`, color: C.dim, marginTop: 6 }}>{r.es}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: '0 0 auto', padding: '10px 22px 14px' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Pill kind="primary" hue={hue} onClick={readAll} style={{ flex: 1 }}>
            🔊 Leer en voz alta
          </Pill>
          <Pill kind="soft" hue={hue} onClick={() => setBig((b) => !b)} style={{ flex: '0 0 auto' }}>
            {big ? 'Aa−' : 'Aa+'}
          </Pill>
        </div>
        <div style={{ textAlign: 'center', font: `700 10px ${C.round}`, letterSpacing: '1px', textTransform: 'uppercase', color: C.faint, marginTop: 12 }}>Funciona sin internet 💛</div>
        {/* Bilingual legal disclaimer — this is the panic/rights screen, so it's the highest-value place for it. */}
        <div style={{ textAlign: 'center', font: `600 10.5px/1.4 ${C.round}`, color: C.faint, marginTop: 8 }}>
          {DISCLAIMER_ES} {DISCLAIMER_EN}
        </div>
      </div>
    </div>
  );
}

// ---------- PHRASEBOOK ----------
export function Phrasebook({ wide }: { wide: boolean }) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: C.bg }}>
      <div style={{ padding: wide ? '8px 8px 24px' : '12px 22px 24px', maxWidth: wide ? 720 : 'none', margin: '0 auto' }}>
        <div style={{ font: `800 24px ${C.round}`, color: C.ink, paddingTop: 4 }}>Mis frases</div>
        <div style={{ font: `600 13px ${C.round}`, color: C.dim, marginTop: 4, marginBottom: 16 }}>Toca la frase para escuchar el inglés. Toca el español para escucharlo también.</div>
        {PHRASES.map((g) => (
          <div key={g.topic} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Glyph topic={g.topic} size={30} radius={9} />
              <span style={{ font: `800 15px ${C.round}`, color: C.ink }}>{TOPICS[g.topic].es}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {g.items.map((p, i) => (
                <div key={i} onClick={() => speak(p.en)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 16, padding: '13px 16px', boxShadow: C.shSoft }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: `800 16px ${C.round}`, color: C.ink }}>{p.en}</div>
                    {/* Tapping the Spanish line hears it too — prefers a pre-generated
                        mp3 (public/audio/es/) over TTS when one exists, see ui.speakEs(). */}
                    <div
                      onClick={(e) => { e.stopPropagation(); speakEs(p.es); }}
                      style={{ font: `600 12px ${C.round}`, color: C.dim, marginTop: 1, cursor: 'pointer' }}
                    >
                      {p.es}
                    </div>
                  </div>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: topicSoft(TOPICS[g.topic].hue), fontSize: 14 }}>
                    🔊
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- PREPÁRATE (family preparedness checklist) ----------
// Bilingual, sourced checklist — see PREP_ITEMS in data.ts for per-item
// citations (ILRC + United We Dream family-preparedness plan, brief
// "Cross-cutting" section). Framed as care, not fear: "Prepararse es cuidar
// a los tuyos." Persisted via the puente_v1 localStorage state in app.tsx.
export function Preparate({
  wide, checked, onToggle,
}: {
  wide: boolean;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const hue = PREPARE_HUE;
  const done = PREP_ITEMS.filter((it) => checked[it.id]).length;
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: C.bg }}>
      <div style={{ padding: wide ? '8px 8px 24px' : '12px 22px 24px', maxWidth: wide ? 720 : 'none', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, paddingTop: 4 }}>
          <Guia size={44} ink={C.ink} ring="rgba(0,0,0,0.1)" label="Tía" />
          <div style={{ flex: 1 }}>
            <div style={{ font: `800 22px/1.15 ${C.round}`, color: C.ink }}>Prepárate</div>
            <div style={{ font: `700 12px ${C.round}`, color: topicInk(hue) }}>Prepararse es cuidar a los tuyos.</div>
          </div>
        </div>
        <div style={{ font: `600 13px/1.5 ${C.round}`, color: C.dim, marginTop: 10, marginBottom: 8 }}>
          Un plan sencillo, hecho con calma. Toca cada tarjeta cuando la tengas lista.
          <br />
          A simple plan, made calmly. Tap each card once it's done.
        </div>
        <div style={{ marginBottom: 16 }}>
          <ProgressBar value={done / PREP_ITEMS.length} hue={hue} />
          <div style={{ font: `800 11px ${C.round}`, color: topicInk(hue), marginTop: 6 }}>{done}/{PREP_ITEMS.length} listo</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PREP_ITEMS.map((it) => {
            const on = !!checked[it.id];
            return (
              <div
                key={it.id}
                onClick={() => onToggle(it.id)}
                style={{
                  cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12, borderRadius: 18,
                  background: on ? topicSoft(hue) : '#fff', border: `1px solid ${on ? topicEdge(hue) : 'transparent'}`,
                  boxShadow: on ? 'none' : C.sh, padding: '14px 16px',
                }}
              >
                <span style={{ fontSize: 20, flex: '0 0 auto', lineHeight: 1.3 }}>{on ? '✅' : it.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ font: `800 14.5px/1.4 ${C.round}`, color: C.ink }}>{it.es}</div>
                  <div
                    onClick={(e) => { e.stopPropagation(); speak(it.en); }}
                    style={{ font: `600 12px/1.4 ${C.round}`, color: C.dim, marginTop: 5, cursor: 'pointer' }}
                  >
                    {it.en}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', font: `600 10.5px/1.4 ${C.round}`, color: C.faint, marginTop: 18 }}>
          {DISCLAIMER_ES} {DISCLAIMER_EN}
        </div>
      </div>
    </div>
  );
}

// ---------- COMING SOON ----------
export function ComingSoon({ topic, onClose }: { topic: TopicKey; onClose: () => void }) {
  const t = TOPICS[topic];
  const hue = t.hue;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: topicSoft(hue), padding: 30 }}>
      <Glyph topic={topic} size={72} radius={22} />
      <div style={{ font: `800 24px ${C.round}`, color: C.ink, marginTop: 20 }}>{t.es}</div>
      <div style={{ font: `600 15px/1.5 ${C.round}`, color: C.dim, marginTop: 10, maxWidth: 280 }}>Esta situación está en camino. Estamos escribiéndola con cuidado, junto a personas que la han vivido.</div>
      <div style={{ marginTop: 24 }}>
        <Pill kind="primary" hue={hue} onClick={onClose}>
          Volver al inicio
        </Pill>
      </div>
    </div>
  );
}

// ---------- DISCREET COVER ----------
export function DiscreetCover({ onUnlock }: { onUnlock: () => void }) {
  const [hint, setHint] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setHint(false), 2600);
    return () => clearTimeout(id);
  }, []);
  return (
    <div
      onDblClick={onUnlock}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#cfe0ef,#eaf1f7)', color: '#33414f', cursor: 'pointer', position: 'relative' }}
    >
      <div style={{ fontSize: 64 }}>⛅</div>
      <div style={{ font: `800 64px ${C.round}`, marginTop: 6 }}>21°</div>
      <div style={{ font: `700 16px ${C.round}` }}>Parcialmente nublado</div>
      <div style={{ font: `600 13px ${C.round}`, marginTop: 4, opacity: 0.7 }}>Tu ciudad · Martes</div>
      {hint && <div style={{ position: 'absolute', bottom: 40, font: `700 12px ${C.round}`, opacity: 0.55 }}>Toca dos veces para volver a Puente</div>}
    </div>
  );
}
