// kit.jsx — shared tokens + phone shell for Puente la Divide direction studies
// Loaded as text/babel. Exports to window at the bottom.

// ---- Topic-color system -------------------------------------------------
// Every scenario owns a hue. Same chroma + lightness => one warm family.
// Deliberately no alarm-reds: calm over fear.
const OK = (l, c, h) => `oklch(${l} ${c} ${h})`;
const TOPICS = {
  parada:  { es: 'La parada',   en: 'A stop',     hue: 250, glyph: '✋', note: 'Police & ICE stops' },
  clinica: { es: 'La clínica',  en: 'The clinic', hue: 155, glyph: '✚', note: 'Health & ER' },
  trabajo: { es: 'El trabajo',  en: 'At work',    hue: 75,  glyph: '⛏', note: 'Wages & safety' },
  casa:    { es: 'La casa',     en: 'Housing',    hue: 40,  glyph: '⌂', note: 'Renting & eviction' },
  escuela: { es: 'La escuela',  en: 'School',     hue: 330, glyph: '✎', note: 'Enrolling kids' },
  corte:   { es: 'La corte',    en: 'Court',      hue: 285, glyph: '§', note: 'Hearings & ID' },
};
// helpers to pull tints of a topic hue
const topicInk   = (h) => OK(0.46, 0.10, h);   // strong
const topicMid   = (h) => OK(0.62, 0.12, h);   // vivid
const topicSoft  = (h) => OK(0.93, 0.035, h);  // wash
const topicEdge  = (h) => OK(0.86, 0.05, h);   // hairline

// ---- Phone shell --------------------------------------------------------
function StatusBar({ dark }) {
  const c = dark ? 'rgba(255,255,255,0.95)' : 'rgba(28,24,20,0.9)';
  return (
    <div style={{ height: 44, flex: '0 0 auto', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 22px 0 26px', color: c,
      font: '600 14px/1 "Hanken Grotesk", system-ui', letterSpacing: '0.2px' }}>
      <span>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ font: '600 11px/1 "Hanken Grotesk"', letterSpacing: '1px', opacity: 0.85 }}>SIN RED</span>
        <span style={{ display: 'inline-flex', gap: 2, alignItems: 'flex-end', height: 11 }}>
          {[5, 7, 9, 11].map((h, i) => (
            <i key={i} style={{ width: 3, height: h, borderRadius: 1, background: c, opacity: i === 3 ? 0.35 : 1 }} />
          ))}
        </span>
        <span style={{ width: 22, height: 11, borderRadius: 3, border: `1.4px solid ${c}`, position: 'relative', display: 'inline-block' }}>
          <i style={{ position: 'absolute', inset: 1.5, right: 7, background: c, borderRadius: 1 }} />
        </span>
      </div>
    </div>
  );
}

// width/height fixed to a comfortable phone; screenBg fills behind everything
function PhoneFrame({ dark, bg, children, bezel = '#1b1714' }) {
  return (
    <div style={{ width: 393, height: 852, boxSizing: 'border-box', borderRadius: 46, background: bezel,
      padding: 4, boxShadow: '0 30px 60px -20px rgba(40,30,20,0.45), 0 2px 6px rgba(0,0,0,0.2)' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 42, background: bg,
        overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <StatusBar dark={dark} />
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {children}
        </div>
        <div style={{ height: 26, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 134, height: 5, borderRadius: 3, background: dark ? 'rgba(255,255,255,0.55)' : 'rgba(28,24,20,0.35)' }} />
        </div>
      </div>
    </div>
  );
}

// A drop-in for the guide character — placeholder, not a hand-drawn person.
function Guia({ size = 44, ink = '#2a241d', ring = 'rgba(0,0,0,0.12)', label = 'guía' }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flex: '0 0 auto',
      background: `repeating-linear-gradient(135deg, ${ink}14 0 4px, transparent 4px 8px)`,
      border: `1.5px solid ${ring}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: ink, font: '600 9px/1 "Hanken Grotesk"', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
      {label}
    </div>
  );
}

Object.assign(window, { OK, TOPICS, topicInk, topicMid, topicSoft, topicEdge, StatusBar, PhoneFrame, Guia });
