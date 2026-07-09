// brief.jsx — the "read me first" brief board + the topic-color system board.

function Chip({ children, c, bg, bd }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
    borderRadius: 999, font: '600 12px/1 "Hanken Grotesk"', color: c, background: bg, border: `1px solid ${bd}` }}>{children}</span>;
}

function BriefBoard() {
  const ink = '#2a241d', dim = 'rgba(42,36,29,0.62)', line = 'rgba(42,36,29,0.12)';
  const H = ({ children }) => <div style={{ font: '600 12px/1 "Hanken Grotesk"', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(42,36,29,0.45)', marginBottom: 14 }}>{children}</div>;
  const Row = ({ k, children }) => (
    <div style={{ display: 'flex', gap: 18, padding: '13px 0', borderTop: `1px solid ${line}` }}>
      <div style={{ width: 132, flex: '0 0 auto', font: '600 14px/1.4 "Hanken Grotesk"', color: ink }}>{k}</div>
      <div style={{ flex: '1 1 auto', font: '400 14px/1.55 "Hanken Grotesk"', color: dim }}>{children}</div>
    </div>
  );
  return (
    <div style={{ width: 760, background: '#fbf8f3', borderRadius: 18, padding: '46px 48px', boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
        <div style={{ font: '600 38px/1 "Newsreader", serif', color: ink, letterSpacing: '-0.5px' }}>Puente la Divide</div>
        <div style={{ font: 'italic 400 17px/1 "Newsreader", serif', color: dim }}>— bridge the divide</div>
      </div>
      <p style={{ font: '400 17px/1.6 "Newsreader", serif', color: 'rgba(42,36,29,0.78)', margin: '0 0 34px', maxWidth: 600 }}>
        A free, offline app that teaches survival English to Spanish speakers — woven, in every lesson,
        with the right to stay safe. Practiced by talking with a guide through the real moments that matter.
      </p>

      <H>What I'm assuming</H>
      <div style={{ marginBottom: 32 }}>
        <Row k="Who it's for">A Spanish speaker, new to the U.S., learning the English they actually need — and what they're allowed to say.</Row>
        <Row k="The core loop">A guide character walks you through a real scenario. You hear it in English, see the Spanish, choose what to say. Rights surface exactly when they're useful.</Row>
        <Row k="Rights = language">Equal weight. You never get a grammar drill detached from a real stakes moment.</Row>
        <Row k="Always reachable">Works fully offline. No account. A discreet exit + a one-tap rights card for the hard moments.</Row>
        <Row k="The tone">Conversational but thorough. Calm, never alarmist. Dignified — you are a person, not a case.</Row>
      </div>

      <H>The journey (this is just the look — flow comes after you pick)</H>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 30 }}>
        {['Web: download', '→', 'First run · no signup', '→', 'Home / today', '→', 'Pick a scenario', '→', 'Conversation w/ guide', '→', 'Rights woven in', '→', 'Quick rights card'].map((s, i) =>
          s === '→'
            ? <span key={i} style={{ color: 'rgba(42,36,29,0.3)', alignSelf: 'center', font: '14px "Hanken Grotesk"' }}>→</span>
            : <Chip key={i} c={ink} bg="#fff" bd={line}>{s}</Chip>
        )}
      </div>

      <H>Three directions to choose from</H>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {[
          ['A · Cartilla', 'Warm paper, editorial serif. Feels like a trusted printed booklet you were handed by someone who cares.', '#7a5c3a'],
          ['B · Señal', 'Bold wayfinding clarity. Huge type, full-bleed topic color. Readable in one glance under stress.', '#2c5d8a'],
          ['C · Aliento', 'Soft, calm, rounded. Lots of air and a friendly guide. Reassuring, modern, gentle.', '#4a7a5c'],
        ].map(([t, d, c]) => (
          <div key={t} style={{ background: '#fff', border: `1px solid ${line}`, borderRadius: 12, padding: '16px 16px 18px' }}>
            <div style={{ width: 26, height: 4, borderRadius: 2, background: c, marginBottom: 12 }} />
            <div style={{ font: '600 15px/1.2 "Hanken Grotesk"', color: ink, marginBottom: 7 }}>{t}</div>
            <div style={{ font: '400 13px/1.5 "Hanken Grotesk"', color: dim }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemBoard() {
  const ink = '#2a241d', dim = 'rgba(42,36,29,0.6)', line = 'rgba(42,36,29,0.12)';
  const H = ({ children }) => <div style={{ font: '600 12px/1 "Hanken Grotesk"', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(42,36,29,0.45)', marginBottom: 16 }}>{children}</div>;
  const keys = Object.keys(TOPICS);
  return (
    <div style={{ width: 760, background: '#fbf8f3', borderRadius: 18, padding: '40px 48px' }}>
      <H>The topic-color system · color changes with the moment</H>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 38 }}>
        {keys.map((k) => {
          const t = TOPICS[k];
          return (
            <div key={k} style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${topicEdge(t.hue)}`, background: topicSoft(t.hue) }}>
              <div style={{ height: 64, background: topicMid(t.hue), display: 'flex', alignItems: 'center', padding: '0 18px', color: '#fff' }}>
                <span style={{ font: '400 26px/1 "Newsreader", serif' }}>{t.glyph}</span>
              </div>
              <div style={{ padding: '12px 16px 14px' }}>
                <div style={{ font: '600 16px/1.1 "Newsreader", serif', color: topicInk(t.hue) }}>{t.es}</div>
                <div style={{ font: '400 12px/1.3 "Hanken Grotesk"', color: dim, marginTop: 3 }}>{t.en} · {t.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div>
          <H>Type</H>
          <div style={{ font: '600 34px/1.05 "Newsreader", serif', color: ink, letterSpacing: '-0.4px' }}>Conozca sus derechos</div>
          <div style={{ font: 'italic 400 18px/1.3 "Newsreader", serif', color: dim, marginTop: 4 }}>Newsreader — warm, literary, dignified</div>
          <div style={{ height: 1, background: line, margin: '18px 0' }} />
          <div style={{ font: '700 20px/1.2 "Hanken Grotesk"', color: ink }}>You can stay silent.</div>
          <div style={{ font: '400 15px/1.45 "Hanken Grotesk"', color: dim, marginTop: 6 }}>Hanken Grotesk — clear, humanist UI &amp; the spoken phrases. Built for fast reading in a tense moment.</div>
        </div>
        <div>
          <H>Principles</H>
          {[
            ['Bilingual by default', 'English to learn, Spanish to lean on — never one without the other.'],
            ['Rights in context', 'A right appears the instant it becomes useful, not in a manual.'],
            ['Calm, not alarm', 'No red, no sirens. Steady color and steady words.'],
            ['Reachable offline', 'The whole thing works on a dead signal, with no account.'],
          ].map(([t, d]) => (
            <div key={t} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: `1px solid ${line}` }}>
              <div style={{ width: 7, height: 7, borderRadius: 2, background: topicMid(250), marginTop: 5, flex: '0 0 auto' }} />
              <div>
                <div style={{ font: '600 14px/1.2 "Hanken Grotesk"', color: ink }}>{t}</div>
                <div style={{ font: '400 13px/1.45 "Hanken Grotesk"', color: dim, marginTop: 2 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BriefBoard, SystemBoard });
