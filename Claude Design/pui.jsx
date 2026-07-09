// pui.jsx — Aliento design tokens, real TTS, and shared UI atoms.
const C = {
  bg: '#fbfaf7', panel: '#ffffff', ink: '#2c2824', dim: 'rgba(44,40,36,0.55)',
  faint: 'rgba(44,40,36,0.4)', round: '"Nunito", system-ui',
  sh: '0 8px 24px -10px rgba(60,50,40,0.22)', shSoft: '0 4px 14px -8px rgba(60,50,40,0.18)',
};

// --- real speech: speak the English aloud (built-in, works offline) ---
let _voices = [];
const _voiceCache = {}; // lang2 -> chosen voice
function _loadVoices() {
  try { _voices = speechSynthesis.getVoices() || []; } catch (e) { return; }
  for (const k in _voiceCache) delete _voiceCache[k];
}
if (typeof speechSynthesis !== 'undefined') {
  _loadVoices();
  speechSynthesis.onvoiceschanged = _loadVoices;
  // Safari/iOS sometimes report voices late — poll briefly until they arrive.
  let _tries = 0;
  const _poll = setInterval(() => { _loadVoices(); if (_voices.length || ++_tries > 20) clearInterval(_poll); }, 250);
}

// Rank a voice for naturalness. Higher = more lifelike. We never hit the network;
// we just pick the best engine already installed on the device, which keeps TTS offline.
function _scoreVoice(v, lang2) {
  if (!v || !v.lang) return -1;
  const vl = v.lang.toLowerCase().replace('_', '-');
  if (!vl.startsWith(lang2)) return -1;
  const n = (v.name || '').toLowerCase();
  let s = 0;
  // Premium / neural engines — the most human-sounding tiers.
  if (n.includes('natural')) s += 60;            // MS "… Natural"
  if (n.includes('neural')) s += 60;
  if (n.includes('premium') || n.includes('enhanced')) s += 55; // Apple premium/enhanced
  if (n.includes('online')) s += 30;             // MS online (still local cache)
  if (n.includes('google')) s += 45;             // Chrome's Google voices are quite natural
  if (n.includes('siri')) s += 50;               // Apple Siri voices
  // Known good named voices across platforms.
  if (/(samantha|alex|ava|allison|aaron|evan|jenny|aria|nova|serena|kate|daniel|karen|moira|tessa)/.test(n)) s += 35;
  if (/(m[óo]nica|paulina|juan|jorge|marisol|helena|laura|elvira|sabina|dalia)/.test(n)) s += 35; // es voices
  // Region match (en-US / es-MX feel right for our audience).
  if (lang2 === 'en' && vl === 'en-us') s += 8;
  if (lang2 === 'es' && (vl === 'es-mx' || vl === 'es-us')) s += 10;
  if (lang2 === 'es' && vl === 'es-es') s += 4;
  // Local engines are lower-latency and work offline; mild preference.
  if (v.localService) s += 5;
  // Penalize the obviously robotic fallbacks.
  if (/(compact|eloquence|fred|albert|zarvox|trinoids|cellos|bells|bahh|boing|jester|wobble|whisper)/.test(n)) s -= 40;
  return s;
}

function _pickVoice(lang2) {
  if (_voiceCache[lang2]) return _voiceCache[lang2];
  let best = null, bestScore = -1;
  for (const v of _voices) {
    const sc = _scoreVoice(v, lang2);
    if (sc > bestScore) { bestScore = sc; best = v; }
  }
  if (best) _voiceCache[lang2] = best;
  return best;
}

function speak(text, lang = 'en-US') {
  try {
    speechSynthesis.cancel();
    const lang2 = lang.slice(0, 2).toLowerCase();
    const v = _pickVoice(lang2);
    const u = new SpeechSynthesisUtterance(text);
    // Use the chosen voice's own locale so it doesn't fall back mid-utterance.
    u.lang = (v && v.lang) || lang;
    if (v) u.voice = v;
    // Warmer, less robotic cadence: a touch slower, natural pitch, full volume.
    u.rate = 0.92;
    u.pitch = 1.02;
    u.volume = 1;
    speechSynthesis.speak(u);
  } catch (e) {}
}

// topic glyph chip
function Glyph({ topic, size = 42, radius = 13 }) {
  const t = TOPICS[topic];
  return (
    <span style={{ width: size, height: size, borderRadius: radius, flex: '0 0 auto', display: 'flex',
      alignItems: 'center', justifyContent: 'center', background: topicSoft(t.hue), color: topicInk(t.hue),
      font: `400 ${Math.round(size * 0.5)}px ${C.round}` }}>{t.glyph}</span>
  );
}

// a small round speak button
function SpeakBtn({ text, hue = 250, light, onPlay }) {
  const [on, setOn] = React.useState(false);
  const fg = light ? '#fff' : topicInk(hue);
  const bg = light ? 'rgba(255,255,255,0.22)' : topicSoft(hue);
  return (
    <button onClick={() => { speak(text); onPlay && onPlay(); setOn(true); setTimeout(() => setOn(false), 900); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', cursor: 'pointer',
        background: bg, color: fg, borderRadius: 999, padding: '7px 13px', font: `800 12.5px ${C.round}` }}>
      <span style={{ display: 'inline-block', transition: 'transform .2s', transform: on ? 'scale(1.25)' : 'scale(1)' }}>🔊</span>
      Escuchar
    </button>
  );
}

// pill button (primary / ghost / dark)
function Pill({ children, onClick, kind = 'primary', hue = 250, full, style }) {
  const map = {
    primary: { background: topicMid(hue), color: '#fff', boxShadow: C.shSoft },
    soft: { background: '#fff', color: topicInk(hue), boxShadow: C.sh },
    dark: { background: C.ink, color: '#fff' },
    ghost: { background: 'transparent', color: C.ink, boxShadow: 'inset 0 0 0 1.5px rgba(44,40,36,0.18)' },
  };
  return (
    <button onClick={onClick} style={{ border: 'none', cursor: 'pointer', borderRadius: 16,
      padding: '15px 20px', font: `800 15px ${C.round}`, width: full ? '100%' : 'auto', whiteSpace: 'nowrap',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, ...map[kind], ...style }}>
      {children}
    </button>
  );
}

// chat bubbles
function Narration({ children }) {
  return <div style={{ textAlign: 'center', font: `700 13px/1.45 ${C.round}`, color: C.dim, padding: '4px 24px', margin: '2px 0' }}>{children}</div>;
}
function OtherBubble({ who, en, es, hue }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      <span style={{ width: 34, height: 34, flex: '0 0 auto', borderRadius: '50%', background: '#fff', boxShadow: C.sh,
        display: 'flex', alignItems: 'center', justifyContent: 'center', font: `800 9px ${C.round}`, color: topicInk(hue), textTransform: 'uppercase' }}>
        {who.slice(0, 2)}
      </span>
      <div style={{ background: '#fff', borderRadius: '6px 20px 20px 20px', padding: '13px 16px', boxShadow: C.sh, maxWidth: 290 }}>
        <div style={{ font: `800 17px/1.3 ${C.round}`, color: C.ink }}>{en}</div>
        <div style={{ font: `600 13px ${C.round}`, color: C.dim, marginTop: 5 }}>{es}</div>
        <div style={{ marginTop: 10 }}><SpeakBtn text={en} hue={hue} /></div>
      </div>
    </div>
  );
}
function GuiaBubble({ children, hue, label = 'Tía Marisol' }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
      <div style={{ background: topicMid(hue), color: '#fff', borderRadius: '20px 20px 6px 20px', padding: '13px 16px', boxShadow: C.sh, maxWidth: 290 }}>
        <div style={{ font: `800 10px ${C.round}`, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.82, marginBottom: 5 }}>💛 {label}</div>
        <div style={{ font: `600 14.5px/1.5 ${C.round}` }}>{children}</div>
      </div>
      <Guia size={34} ink="#fff" ring="rgba(255,255,255,0.45)" label="Tía" />
    </div>
  );
}
function YouBubble({ en, es }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ background: C.ink, color: '#fff', borderRadius: '20px 20px 20px 6px', padding: '12px 16px', maxWidth: 280 }}>
        <div style={{ font: `800 16px/1.25 ${C.round}` }}>{en}</div>
        <div style={{ font: `600 12px ${C.round}`, opacity: 0.6, marginTop: 3 }}>{es}</div>
      </div>
    </div>
  );
}

function ProgressBar({ value, hue }) {
  return (
    <div style={{ height: 8, borderRadius: 6, background: '#fff', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(44,40,36,0.06)' }}>
      <div style={{ width: `${Math.round(value * 100)}%`, height: '100%', borderRadius: 6, background: topicMid(hue), transition: 'width .35s cubic-bezier(.2,.7,.3,1)' }} />
    </div>
  );
}

// ---- speech recognition (STT) — live stand-in for on-device Whisper ----
function speechRecognitionAvailable() {
  return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}
// Returns a stop() function. Calls back with interim + final text.
function recognizeOnce({ lang = 'en-US', onInterim, onResult, onError, onEnd } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { onError && onError('unsupported'); return () => {}; }
  let rec;
  try { rec = new SR(); } catch (e) { onError && onError('unsupported'); return () => {}; }
  rec.lang = lang; rec.interimResults = true; rec.maxAlternatives = 3; rec.continuous = false;
  let finalText = '';
  rec.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript; else interim += r[0].transcript;
    }
    if (interim) onInterim && onInterim(interim);
    if (finalText) onResult && onResult(finalText);
  };
  rec.onerror = (e) => { onError && onError((e && e.error) || 'error'); };
  rec.onend = () => { onEnd && onEnd(finalText); };
  try { speechSynthesis.cancel(); } catch (e) {}
  try { rec.start(); } catch (e) { onError && onError('start'); }
  return () => { try { rec.stop(); } catch (e) {} };
}

// ---- forgiving phrase matching (learner pronunciation is imperfect) ----
function normalizePhrase(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9áéíóúñü\s]/gi, '').replace(/\s+/g, ' ').trim();
}
function _lev(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[n];
}
// 0..1 — blends character distance with word overlap, takes the kinder of the two.
function phraseSimilarity(heard, target) {
  const a = normalizePhrase(heard), b = normalizePhrase(target);
  if (!a || !b) return 0;
  const charSim = 1 - _lev(a, b) / Math.max(a.length, b.length);
  const aw = a.split(' '), bw = b.split(' ');
  const shared = bw.filter((w) => aw.includes(w)).length;
  const wordSim = shared / bw.length;
  return Math.max(charSim, wordSim);
}

Object.assign(window, { C, speak, Glyph, SpeakBtn, Pill, Narration, OtherBubble, GuiaBubble, YouBubble, ProgressBar,
  speechRecognitionAvailable, recognizeOnce, normalizePhrase, phraseSimilarity });
