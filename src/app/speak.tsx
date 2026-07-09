// src/app/speak.tsx — "Ahora dilo tú": the speaking-practice control.
//
// THREAT MODEL CONSTRAINT: the Claude Design prototype (pspeak.jsx) used the
// browser SpeechRecognition API to score the user's pronunciation live. On
// Chrome, SpeechRecognition streams microphone audio to Google's servers to
// transcribe it — that is a live network call carrying the user's voice off
// the device, which breaks this project's non-negotiable no-telemetry /
// no-network / no-mic-API threat model (see CLAUDE.md). We do NOT use
// SpeechRecognition, getUserMedia, or any other microphone API here.
//
// Instead this is "listen & repeat": the app speaks the target phrase aloud
// (on-device speechSynthesis, see ui.tsx), the learner repeats it out loud on
// their own — no recording, nothing captured — and self-reports with two
// buttons ("Otra vez" to hear it again, "Lo dije" once they've said it). The
// component keeps the prototype's exact props shape (target, hue, onDone) so
// an on-device recognizer (e.g. a local Whisper build) can slot in later
// without touching call sites.
import { useEffect, useState } from 'preact/hooks';
import { C, Pill, speak, topicInk, topicSoft } from './ui';
import type { Phrase } from './data';

function PhraseCard({ target, hue }: { target: Phrase; hue: number }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '12px 16px', boxShadow: C.shSoft, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ font: `800 17px/1.2 ${C.round}`, color: C.ink }}>{target.en}</div>
        <div style={{ font: `600 12px ${C.round}`, color: C.dim, marginTop: 2 }}>{target.es}</div>
      </div>
      <button
        onClick={() => speak(target.en)}
        aria-label="Escuchar la frase"
        style={{ border: 'none', cursor: 'pointer', width: 36, height: 36, flex: '0 0 auto', borderRadius: '50%', background: topicSoft(hue), color: topicInk(hue), fontSize: 15 }}
      >
        🔊
      </button>
    </div>
  );
}

export function SpeakPractice({ target, hue, onDone }: { target: Phrase; hue: number; onDone: (heard: string, ok: boolean) => void }) {
  const [phase, setPhase] = useState<'practice' | 'done'>('practice');

  // Say the target phrase once when practice begins — the learner's cue to repeat it.
  useEffect(() => {
    speak(target.en);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.en]);

  if (phase === 'done') {
    return (
      <div>
        <div style={{ font: `800 11px ${C.round}`, letterSpacing: '1px', textTransform: 'uppercase', color: C.dim, marginBottom: 10 }}>🎤 Ahora dilo tú</div>
        <div style={{ background: topicSoft(155), borderRadius: 16, padding: '13px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🌿</span>
            <span style={{ font: `800 14px ${C.round}`, color: topicInk(155) }}>¡Bien hecho! Esa frase ya es tuya.</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 11 }}>
          <Pill kind="soft" hue={hue} onClick={() => { setPhase('practice'); speak(target.en); }} style={{ flex: 1 }}>
            ↺ Otra vez
          </Pill>
          <Pill kind="primary" hue={hue} onClick={() => onDone(target.en, true)} style={{ flex: 1.5 }}>
            Continuar →
          </Pill>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ font: `800 11px ${C.round}`, letterSpacing: '1px', textTransform: 'uppercase', color: C.dim, marginBottom: 10 }}>🎤 Ahora dilo tú</div>
      <PhraseCard target={target} hue={hue} />
      <div style={{ font: `600 12.5px/1.45 ${C.round}`, color: C.dim, margin: '11px 2px 0' }}>
        Escúchala y repítela en voz alta, a tu propio ritmo. Nadie te está escuchando — solo tú decides cuándo ya te salió.
      </div>
      <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
        <Pill kind="soft" hue={hue} onClick={() => speak(target.en)} style={{ flex: 1 }}>
          🔊 Otra vez
        </Pill>
        <Pill kind="primary" hue={hue} onClick={() => setPhase('done')} style={{ flex: 1.4 }}>
          Lo dije ✓
        </Pill>
      </div>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <button onClick={() => onDone('', false)} style={{ border: 'none', background: 'none', cursor: 'pointer', font: `700 12px ${C.round}`, color: C.faint }}>
          Saltar por ahora
        </button>
      </div>
    </div>
  );
}
