// src/app/data.ts — typed content for the Puente la Divide app island.
// Ported from Claude Design/pdata.jsx (content) + Claude Design/kit.jsx (topic
// color system). Narrative framing (Tía Marisol, scene descriptions, dialogue)
// is invented, as expected for a guided-practice UX. Every RIGHTS claim is
// sourced — see inline comments. Do not invent or alter legal wording.
// Content-vet pass applied 2026-07-09 (registro wording, canonical ACLU
// phrase forms, clinica protected-areas rewrite, trabajo phrases removed).
import coreRights from '../content/phrases/core-rights.json';

export type TopicKey = 'parada' | 'clinica' | 'trabajo' | 'casa' | 'escuela' | 'corte';

export interface Topic {
  es: string;
  en: string;
  hue: number;
  glyph: string;
  note: string;
}

// Deliberately no alarm-reds: calm over fear. One hue per topic, same chroma/lightness.
export const TOPICS: Record<TopicKey, Topic> = {
  parada: { es: 'La parada', en: 'A stop', hue: 250, glyph: '✋', note: 'Police & ICE stops' },
  clinica: { es: 'La clínica', en: 'The clinic', hue: 155, glyph: '✚', note: 'Health & ER' },
  trabajo: { es: 'El trabajo', en: 'At work', hue: 75, glyph: '⛏', note: 'Wages & safety' },
  casa: { es: 'La casa', en: 'Housing', hue: 40, glyph: '⌂', note: 'Renting & eviction' },
  escuela: { es: 'La escuela', en: 'School', hue: 330, glyph: '✎', note: 'Enrolling kids' },
  corte: { es: 'La corte', en: 'Court', hue: 285, glyph: '§', note: 'Hearings & ID' },
};

export const APP_TOPICS: TopicKey[] = ['parada', 'clinica', 'trabajo', 'casa', 'escuela', 'corte'];

// Only "parada" and "clinica" are fully playable in this vertical slice.
export const LOCKED: Partial<Record<TopicKey, boolean>> = {
  trabajo: true,
  casa: true,
  escuela: true,
  corte: true,
};

export interface Phrase {
  en: string;
  es: string;
}

export interface ChooseOption extends Phrase {
  tone: 'best' | 'good';
  reply: string;
}

export type ScenarioStep =
  | { t: 'scene'; emoji: string; es: string }
  | { t: 'tip'; es: string; en?: string; phrase?: string }
  | { t: 'say'; who: string; en: string; es: string }
  | { t: 'choose'; prompt: string; options: ChooseOption[] }
  | { t: 'speak'; target: Phrase }
  | { t: 'recap'; es: string; learned: Phrase[] };

export interface Scenario {
  key: TopicKey;
  title: string;
  en: string;
  blurb: string;
  minutes: number;
  steps: ScenarioStep[];
}

export const SCENARIOS: Partial<Record<TopicKey, Scenario>> = {
  // Rights claims below (silence about immigration status, refusing a search,
  // "am I free to go") mirror src/content/scenarios/en/traffic-stop.mdx,
  // sourced there to: ACLU KYR for immigrants; ILRC Red Card 2024.
  parada: {
    key: 'parada',
    title: 'La parada',
    en: 'A traffic stop',
    blurb: 'Qué decir —y qué puedes callar— cuando un oficial te detiene.',
    minutes: 4,
    steps: [
      { t: 'scene', emoji: '🚗', es: 'Vas conduciendo a casa. Detrás de ti aparecen luces rojas y azules.' },
      { t: 'tip', es: 'Respira. Pon la direccional, detente en un lugar seguro y apaga el motor. Baja un poco la ventana y deja las manos en el volante, donde se vean.', en: 'Stay calm. Pull over safely and keep your hands where they can be seen.' },
      { t: 'say', who: 'El oficial', en: 'License and registration, please.', es: 'Licencia y registración, por favor.' },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        { en: 'Here you are, officer.', es: 'Aquí tiene, oficial.', tone: 'best', reply: 'Muy bien. Entregar tus documentos es cooperar — eso está bien y te mantiene seguro.' },
        { en: 'Why did you stop me?', es: '¿Por qué me detuvo?', tone: 'good', reply: 'Puedes preguntarlo, con calma y respeto.' },
      ] },
      { t: 'say', who: 'El oficial', en: 'Where were you born?', es: '¿Dónde nació usted?' },
      { t: 'tip', es: 'Esta pregunta es sobre tu estatus migratorio. No tienes que responderla. Puedes guardar silencio, con respeto.', en: 'You do not have to answer questions about your immigration status.', phrase: 'I want to remain silent.' },
      { t: 'speak', target: { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.' } },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        { en: 'I prefer not to answer.', es: 'Prefiero no responder.', tone: 'good', reply: 'Cortés y firme. Proteges tu derecho sin levantar tensión.' },
        { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.', tone: 'best', reply: 'Esa frase es tu derecho. Puedes repetirla con calma las veces que necesites.' },
      ] },
      { t: 'say', who: 'El oficial', en: 'Are you a citizen?', es: '¿Es usted ciudadano?' },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.', tone: 'best', reply: 'Bien. No tienes que hablar de tu estatus con nadie en la calle.' },
        { en: 'Am I free to go?', es: '¿Soy libre de irme?', tone: 'good', reply: 'Buena pregunta. Si te dicen que sí, puedes irte con calma. Si no, sigues en silencio.' },
      ] },
      { t: 'speak', target: { en: 'Am I free to go?', es: '¿Soy libre de irme?' } },
      { t: 'recap', es: 'Lo hiciste muy bien, Rosa. Estas frases ya son tuyas — guárdalas en el bolsillo.', learned: [
        { en: 'Here you are, officer.', es: 'Aquí tiene, oficial.' },
        { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.' },
        { en: 'Am I free to go?', es: '¿Soy libre de irme?' },
      ] },
    ],
  },
  clinica: {
    key: 'clinica',
    title: 'La clínica',
    en: 'The clinic',
    blurb: 'Pedir atención médica con claridad — y conocer tus derechos en la sala de espera.',
    minutes: 3,
    steps: [
      { t: 'scene', emoji: '🏥', es: 'Llegas a la sala de emergencias. La recepcionista te saluda desde el mostrador.' },
      // Rewritten per content-vet 2026-07-09: the earlier "emergency care
      // regardless of status" tip stood alone and could read as "clinics are
      // safe from ICE" — false since the protected-areas (sensitive locations)
      // policy was rescinded Jan 20, 2025. Source for the rescission: NILC,
      // "Factsheet: Trump's Rescission of Protected Areas Policies…"
      // https://www.nilc.org/resources/factsheet-trumps-rescission-of-protected-areas-policies-undermines-safety-for-all/
      // The rights statements are the ACLU-sourced universal rights (see RIGHTS).
      { t: 'tip', es: 'Algo importante, con calma: desde enero de 2025, los hospitales y clínicas ya no cuentan con protección especial contra operativos de inmigración. Tus derechos sí van contigo a todas partes: puedes permanecer en silencio y no dar consentimiento a un registro.', en: 'Since January 2025, hospitals and clinics are no longer specially protected from immigration enforcement. Your rights still go with you everywhere: you can remain silent and refuse consent to a search.', phrase: 'I want to remain silent.' },
      { t: 'say', who: 'Recepción', en: 'Do you have insurance?', es: '¿Tiene seguro médico?' },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        { en: "I don't have insurance.", es: 'No tengo seguro.', tone: 'good', reply: 'Está bien decirlo con calma. Puedes preguntar qué opciones de pago existen.' },
        { en: 'Can we talk about payment later?', es: '¿Podemos hablar del pago después?', tone: 'best', reply: 'Sí — explica primero tu emergencia. Preguntar por el pago puede esperar.' },
      ] },
      { t: 'say', who: 'Recepción', en: 'What brings you in today?', es: '¿Qué lo trae hoy?' },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        { en: 'I have strong chest pain.', es: 'Tengo un dolor fuerte en el pecho.', tone: 'best', reply: 'Claro y directo. Eso ayuda a que te atiendan rápido.' },
        { en: 'I need to see a doctor, please.', es: 'Necesito ver a un doctor, por favor.', tone: 'good', reply: 'Muy bien. Sencillo y claro.' },
      ] },
      { t: 'speak', target: { en: 'I need to see a doctor, please.', es: 'Necesito ver a un doctor, por favor.' } },
      { t: 'recap', es: 'Pediste ayuda con calma y claridad. Tu salud va primero, siempre.', learned: [
        { en: 'I need to see a doctor, please.', es: 'Necesito ver a un doctor.' },
        { en: 'Can we talk about payment later?', es: '¿Podemos hablar del pago después?' },
      ] },
    ],
  },
};

// Quick rights statements for the panic card. Each maps to core-rights.json
// (src/content/scenarios/**), which cites: ILRC Red Card 2024 / ACLU KYR for
// immigrants — see that file for the exact per-phrase citation.
export const RIGHTS: Phrase[] = [
  { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.' }, // core-rights "remain-silent" — ACLU KYR for immigrants
  { en: 'I do not consent to a search.', es: 'No doy mi consentimiento para un registro.' }, // core-rights "no-consent-search-car" / "no-consent-search-home" — ACLU KYR for immigrants; "registro" is the app's established legal term (content-vet 2026-07-09)
  { en: 'I want to speak to a lawyer.', es: 'Quiero hablar con un abogado.' }, // core-rights "want-lawyer" — ACLU KYR for immigrants
  { en: 'Am I free to go?', es: '¿Soy libre de irme?' }, // core-rights "am-i-free-to-leave" — ACLU KYR for immigrants
  { en: 'I do not wish to answer questions.', es: 'No deseo responder preguntas.' }, // core-rights "no-questions-without-lawyer" — ACLU KYR for immigrants
];

export const PHRASES: { topic: TopicKey; items: Phrase[] }[] = [
  { topic: 'parada', items: [
    { en: 'Here you are, officer.', es: 'Aquí tiene, oficial.' },
    { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.' }, // ACLU KYR for immigrants (see RIGHTS above)
    { en: 'Am I free to go?', es: '¿Soy libre de irme?' }, // ACLU KYR for immigrants (see RIGHTS above)
  ] },
  { topic: 'clinica', items: [
    { en: 'I need to see a doctor.', es: 'Necesito ver a un doctor.' },
    { en: 'It hurts here.', es: 'Me duele aquí.' },
    { en: 'Can we talk about payment later?', es: '¿Podemos hablar del pago después?' },
  ] },
  // trabajo phrases removed per content-vet 2026-07-09: unsourced and the
  // topic is locked/"coming soon" — re-add only with an allowlisted citation.
];

export const ONBOARDING: { emoji: string; title: string; body: string }[] = [
  { emoji: '🌅', title: 'El inglés que de verdad necesitas', body: 'Aprende a hablar en los momentos que importan — y conoce tus derechos en cada paso.' },
  { emoji: '📶', title: 'Funciona sin internet', body: 'Sin cuenta. Sin rastro. Todo vive en tu teléfono y nadie más lo ve.' },
  { emoji: '💛', title: 'Tu guía, siempre contigo', body: 'Tía Marisol te acompaña en cada situación, con calma y sin juzgar.' },
];

// Bilingual legal disclaimer — must stay visible per project CLAUDE.md.
export const DISCLAIMER_EN = 'This is general information, not legal advice. For your situation, contact a lawyer.';
export const DISCLAIMER_ES = 'Esto es información general, no asesoría legal. Para su situación, consulte a un abogado.';

// ---- Spanish audio: reuse the pre-generated mp3s in public/audio/es/*.mp3 --
// (see PhraseCard.astro / PracticeDeck.astro) instead of speechSynthesis when
// a phrase's Spanish wording exactly matches a sourced entry in
// core-rights.json. Matching is by exact normalized text, never fuzzy — so we
// only ever attach pre-recorded audio to text that is verbatim what's shown
// on screen (this deck's Spanish wording is often paraphrased differently
// from core-rights.json, e.g. "guardar silencio" vs "permanecer en
// silencio" — those intentionally fall back to on-device TTS instead).
function normalizeEs(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFC')
    .replace(/[¿?¡!.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const SPANISH_AUDIO_BY_TEXT: Record<string, string> = {};
for (const p of coreRights.phrases) {
  SPANISH_AUDIO_BY_TEXT[normalizeEs(p.es)] = p.id;
}

/** Slug of a pre-generated public/audio/es/<slug>.mp3, if this exact Spanish phrase has one. */
export function spanishAudioSlug(es: string): string | undefined {
  return SPANISH_AUDIO_BY_TEXT[normalizeEs(es)];
}
