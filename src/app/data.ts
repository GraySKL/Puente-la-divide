// src/app/data.ts — typed content for the Puente la Divide app island.
// Ported from Claude Design/pdata.jsx (content) + Claude Design/kit.jsx (topic
// color system). Narrative framing (Tía Marisol, scene descriptions, dialogue)
// is invented, as expected for a guided-practice UX. Every RIGHTS claim is
// sourced — see inline comments. Do not invent or alter legal wording.
// Content-vet pass applied 2026-07-09 (registro wording, canonical ACLU
// phrase forms, clinica protected-areas rewrite, trabajo phrases removed).
// Deepening pass 2026-07-09: parada deepened, casa + trabajo scenarios added,
// Prepárate checklist added. ALL facts/guidance below sourced ONLY from
// docs/research/2026-07-encounter-reality-brief.md (Track A = what happens,
// scene framing only; Track B = what to do, from rights orgs). See per-line
// comments for section + org citation. Escuela/corte remain locked — the
// brief found no verified claims for those settings (see brief §5/§6).
import coreRights from '../content/phrases/core-rights.json';

// ---- guide character preference — Tía Marisol (default) or Tío Mateo -------
// Same personality, same words; only name, grammatical gender, and voice
// change (owner decision 2026-07-10). Any UI string that names or genders
// the guide should route through getGuide() rather than hardcoding one.
export type GuidePref = 'marisol' | 'mateo';
export interface GuideConfig {
  nombre: string; // 'Tía Marisol' | 'Tío Mateo'
  short: string; // avatar-circle label: 'Tía' | 'Tío'
  label: string; // uppercase chip label: 'TÍA MARISOL' | 'TÍO MATEO'
}
const GUIDES: Record<GuidePref, GuideConfig> = {
  marisol: { nombre: 'Tía Marisol', short: 'Tía', label: 'TÍA MARISOL' },
  mateo: { nombre: 'Tío Mateo', short: 'Tío', label: 'TÍO MATEO' },
};
export function getGuide(pref: GuidePref): GuideConfig {
  return GUIDES[pref] || GUIDES.marisol;
}

// ---- grammatical-address preference — how the app's Spanish addresses the
// USER (owner decision 2026-07-10, upgraded from future-feature to shipped).
// Default 'f' preserves the app's existing house style. This is a pure text
// concern — it never touches audio (see CRITICAL AUDIO CHECK note below) —
// so unlike VoicePref/GuidePref it has no ui.tsx module-level mirror.
export type AddressPref = 'f' | 'm';

// «feminine|masculine» tokens in ES content strings, resolved at render time.
// Mechanism chosen over dual es/esM fields so only the morpheme differs —
// the rest of a sentence is physically the same string and can't drift
// between variants. A string with no token round-trips unchanged.
// CRITICAL AUDIO CHECK: no string containing this token is ever passed to
// speak()/speakEs() — grep for '«' in src/app to re-verify after edits.
export function resolveAddress(text: string, address: AddressPref): string {
  return text.replace(/«([^|»]*)\|([^»]*)»/g, (_m, f: string, m: string) => (address === 'f' ? f : m));
}

// "Vamos juntas/juntos" — correct only when BOTH the guide is Marisol AND
// the address preference is feminine (a feminine pair); any other
// combination (Mateo, or masculine address, or both) takes the masculine
// default "juntos" per standard Spanish mixed/masculine-default agreement.
export function juntxsFor(guide: GuidePref, address: AddressPref): string {
  return guide === 'marisol' && address === 'f' ? 'juntas' : 'juntos';
}

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

// "parada", "clinica", "trabajo" and "casa" are playable. "escuela" and
// "corte" stay locked: the research brief found no claims that survived
// verification for either setting (brief §4 courthouse = thin/medium
// confidence only; §5/§6 clinics+schools = no claims survived at all) — do
// not deepen or unlock until a dedicated research pass runs.
export const LOCKED: Partial<Record<TopicKey, boolean>> = {
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
  | { t: 'docs'; items: { src: string; es: string; en: string; alt: string }[]; creditEs: string; creditEn: string }
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
      // Track A (scene framing only — never guidance): ProPublica documented
      // ~50 vehicle-window-breaking incidents by agents in the first ~6
      // months of 2025, vs. 8 in the entire prior decade (count not
      // comprehensive — no government stats exist). Brief §1.
      // https://projects.propublica.org/trump-ice-smashed-windows-deportation-arrests/
      // Deliberately excludes: any injury count (REFUTED per brief) and any
      // guidance on how far to lower the window (not in the verified set).
      // Track B calm/silence framing: ILRC.
      // https://www.ilrc.org/community-resources/know-your-rights/know-your-rights-when-confronted-ice-flyer
      // «segura|seguro» — address-aware (owner decision 2026-07-10); see
      // AddressPref/resolveAddress above. Not audible — this tip is never
      // passed to speak()/speakEs().
      { t: 'tip', es: 'Sé que da miedo cuando la ventana está subida y no ves bien quién se acerca. Ese miedo es real — ha habido reportes de ventanas rotas durante paradas de tránsito. Aun así, lo que te mantiene más «segura|seguro» sigue siendo lo mismo: cuerpo tranquilo, manos visibles, y tus derechos dichos en voz alta.', en: "It's frightening when the window is up and you can't see clearly who's approaching. That fear is real — window-breaking during traffic stops has been documented. Even so, what keeps you safest is still the same: a calm body, visible hands, and your rights spoken out loud." },
      { t: 'say', who: 'El oficial', en: 'License and registration, please.', es: 'Licencia y registración, por favor.' },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        // «segura|seguro» — was hardcoded masculine ("seguro") here even
        // though the house default is feminine; corrected to match the
        // house-style default and made address-aware like the instance
        // above, so both respond to the same toggle consistently.
        { en: 'Here you are, officer.', es: 'Aquí tiene, oficial.', tone: 'best', reply: 'Muy bien. Entregar tus documentos es cooperar — eso está bien y te mantiene «segura|seguro».' },
        { en: 'Why did you stop me?', es: '¿Por qué me detuvo?', tone: 'good', reply: 'Puedes preguntarlo, con calma y respeto.' },
      ] },
      { t: 'say', who: 'El oficial', en: 'Where were you born?', es: '¿Dónde nació usted?' },
      // NILC, May 2025 KYR card (brief §1 Track B): immigration enforcement
      // is now also carried out by non-ICE agencies (local police, DEA);
      // agents commonly identify only as "police" — explicitly ask which
      // agency.
      // https://media.nilc.org/wp-content/uploads/2025/05/KYR-What-To-Do-if-Immigration-Approaches-Arrests-or-Detains-You-ENG-May-2025.pdf
      { t: 'tip', es: 'Hoy, no solo agentes de ICE hacen labores de inmigración — a veces son policías locales u otras agencias. Muchos dicen solo "policía", aunque no lo sean. Puedes preguntar, con calma, de qué agencia es.', en: 'Today, immigration enforcement isn\'t carried out only by ICE agents — sometimes it\'s local police or other agencies. Many identify themselves only as "police," even when they aren\'t. You can calmly ask which agency they represent.', phrase: 'Which agency are you with?' },
      { t: 'speak', target: { en: 'Which agency are you with?', es: '¿De qué agencia es usted?' } },
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
      // {learner} is the player's own display name (not the guide's — see
      // getGuide()/{name} in scenario.tsx) — render-side templating drops
      // the whole ", {learner}" clause gracefully when no name is set.
      { t: 'recap', es: 'Lo hiciste muy bien, {learner}. Estas frases ya son tuyas — guárdalas en el bolsillo.', learned: [
        { en: 'Here you are, officer.', es: 'Aquí tiene, oficial.' },
        { en: 'Which agency are you with?', es: '¿De qué agencia es usted?' },
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
  // Sourcing basis for this scenario: docs/research/2026-07-encounter-reality-brief.md §3
  // (workplace raids). Thin Track B guidance — deliberately modest depth.
  // Explicitly excludes (open questions per brief §3): during-raid
  // movement/exit advice, bystander/collateral-arrest specifics, and
  // "state you are not the target."
  trabajo: {
    key: 'trabajo',
    title: 'El trabajo',
    en: 'At work',
    blurb: 'Cuerpo tranquilo, voz firme — tus derechos no cambian en el trabajo.',
    minutes: 3,
    steps: [
      { t: 'scene', emoji: '🏭', es: 'Estás en tu turno de trabajo cuando agentes de inmigración entran al lugar. El ambiente se pone tenso.' },
      // Track A framing only, no statistics recited to the user (brief §3,
      // explicit instruction): 2025 worksite enforcement surged nationally.
      // https://www.americanimmigrationcouncil.org/wp-content/uploads/2025/10/Worksite-Enforcement-Factsheet-2025.pdf
      { t: 'tip', es: 'Las acciones de inmigración en lugares de trabajo se han vuelto más frecuentes. Si esto pasa, lo que ya sabes sigue aplicando.', en: 'Immigration enforcement actions at workplaces have become more frequent. If this happens, what you already know still applies.' },
      // content-vet 2026-07-09: "don't run" guidance is verified only for
      // street/vehicle encounters (brief §1); during-raid movement advice is
      // an open question (brief §3) — this tip stays to body language only.
      { t: 'tip', es: 'Cuerpo tranquilo. Manos donde se puedan ver.', en: 'Calm body. Hands where they can be seen.' },
      // Silence out loud: ILRC (brief §1 Track B). Never present false or
      // foreign documents: ILRC Red Card "do-not-lie" preparedness rule +
      // United We Dream (brief cross-cutting family-preparedness section).
      { t: 'tip', es: 'Tu voz: puedes decir en voz alta y con respeto que vas a permanecer en silencio sobre tu estatus migratorio. Nunca muestres documentos falsos o de otro país — eso puede perjudicar tu caso.', en: "Your voice: you can say out loud, respectfully, that you're going to remain silent about your immigration status. Never show false or foreign documents — that can hurt your case.", phrase: 'I want to remain silent.' },
      { t: 'speak', target: { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.' } },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        { en: 'I prefer not to answer.', es: 'Prefiero no responder.', tone: 'good', reply: 'Cortés y firme — no tienes que explicar tu estatus migratorio ahí.' },
        { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.', tone: 'best', reply: 'Bien. Puedes repetir esta frase con calma las veces que necesites.' },
      ] },
      // Judicial/administrative warrant distinction applies to non-public
      // workplace areas too (brief §3 Track B, same sources as §2: AIC,
      // NILC, ILRC, NIJC, ACLU-NC).
      { t: 'tip', es: 'Si los agentes quieren entrar a áreas que no son públicas —como la oficina o el almacén— necesitan una orden judicial firmada por un juez, igual que en tu casa. También puedes pedir hablar con un abogado.', en: 'If agents want to enter non-public areas — like the office or the stockroom — they need a judicial warrant signed by a judge, just like at your home. You can also ask to speak with a lawyer.', phrase: 'I want to speak to a lawyer.' },
      { t: 'speak', target: { en: 'I want to speak to a lawyer.', es: 'Quiero hablar con un abogado.' } },
      { t: 'recap', es: 'Aunque el lugar cambie, tus derechos no cambian. Cuerpo tranquilo, voz firme.', learned: [
        { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.' },
        { en: 'I want to speak to a lawyer.', es: 'Quiero hablar con un abogado.' },
      ] },
    ],
  },
  // Sourcing basis for this scenario: docs/research/2026-07-encounter-reality-brief.md §2
  // (home/the door) — the strongest-sourced setting, so this is the richest
  // scenario. The judicial-vs-administrative warrant distinction and the
  // door-closed protocol are unanimous across AIC/NILC/ILRC/NIJC/ACLU-NC
  // (brief §2 Track B, high confidence).
  casa: {
    key: 'casa',
    title: 'La casa',
    en: 'The door at home',
    blurb: 'Qué hacer —y qué decir— cuando alguien toca a tu puerta.',
    minutes: 5,
    steps: [
      { t: 'scene', emoji: '🚪', es: 'Tocan la puerta con fuerza. Estás en casa con tu familia.' },
      { t: 'say', who: 'La voz afuera', en: 'Police! Open the door.', es: '¡Policía! Abran la puerta.' },
      // Track A: agents misrepresent themselves as "police" (brief §2,
      // corroborated by ACLU-SoCal's ICE-impersonation page). Track B: NILC,
      // May 2025 KYR card — ask which agency.
      // https://media.nilc.org/wp-content/uploads/2025/05/KYR-What-To-Do-if-Immigration-Approaches-Arrests-or-Detains-You-ENG-May-2025.pdf
      { t: 'tip', es: 'Igual que en la calle, quien toca a tu puerta no siempre es quien dice ser — a veces dicen "policía" aunque sean de otra agencia. Puedes preguntar de qué agencia son, sin abrir la puerta.', en: 'Just like on the street, whoever\'s knocking isn\'t always who they claim to be — sometimes they say "police" even when they\'re a different agency. You can ask which agency they\'re with, without opening the door.', phrase: 'Which agency are you with?' },
      { t: 'speak', target: { en: 'Which agency are you with?', es: '¿De qué agencia es usted?' } },
      // Unanimous across rights orgs (brief §2 Track B, 6 of 7 sub-claims
      // 3-0): AIC, NILC, ILRC, NIJC, ACLU-NC — do not open the door, even
      // partially; talk through it; ask for any claimed warrant to be slid
      // under the door or shown through a window/peephole.
      // https://immigrantjustice.org/for-immigrants/know-your-rights/ice-encounter/
      { t: 'tip', es: 'No abras la puerta, ni siquiera un poco. Puedes hablar a través de ella con toda calma. Si dicen tener una orden, pide que la deslicen por debajo de la puerta o la muestren en la ventana.', en: 'Do not open the door, not even partway. You can talk through it, calmly. If they say they have a warrant, ask them to slide it under the door or show it through the window.', phrase: 'Please slide the warrant under the door so I can read it.' },
      { t: 'speak', target: { en: 'Please slide the warrant under the door so I can read it.', es: 'Por favor, deslice la orden por debajo de la puerta para que la pueda leer.' } },
      { t: 'scene', emoji: '📄', es: 'Un papel aparece debajo de la puerta. Dice "Formulario I-200" y lo firma un oficial de ICE — no un juez.' },
      // Administrative warrants (DHS Form I-200/I-205, signed by an ICE
      // officer or immigration judge) do NOT authorize home entry without
      // consent. Only a judicial warrant — signed by a judge, naming the
      // correct person and address — does. Stated identically by AIC, NILC,
      // ILRC, NIJC, ACLU-NC (brief §2 Track B, high confidence). ACLU-NC
      // hosts annotated example documents (judicial vs. I-200 marked "NOT
      // VALID… not signed by a judge"): https://www.acluofnorthcarolina.org/know-your-rights/kyr-ir/
      { t: 'tip', es: 'Hay una diferencia enorme entre dos papeles que pueden parecerse. Una orden JUDICIAL —firmada por un juez, con tu nombre y tu dirección correctos— sí permite la entrada. Una orden ADMINISTRATIVA de ICE —los formularios I-200 o I-205, firmados por un oficial de inmigración o por un juez de inmigración— NO permite la entrada sin tu permiso.', en: 'There is a huge difference between two papers that can look alike. A JUDICIAL warrant — signed by a judge, with your correct name and address — does authorize entry. An ICE ADMINISTRATIVE warrant — Forms I-200 or I-205, signed by an immigration officer or an immigration judge — does NOT authorize entry without your permission.' },
      // Annotated sample documents (added by Sara 2026-07-09) from ACLU of
      // South Carolina — ACLU state affiliate, owner-approved source:
      // https://www.aclusc.org/immigration-enforcement-administrative-vs-judicial-warrants/
      { t: 'docs', items: [
        { src: 'img/warrants/ice-administrative-i200-sample.png', es: 'Así se ve un Formulario I-200 de ICE — lo firma un oficial de inmigración. NO autoriza la entrada a tu casa.', en: 'This is what an ICE Form I-200 looks like — signed by an immigration officer. It does NOT authorize entry into your home.', alt: 'Sample ICE Form I-200 administrative warrant, annotated by the ACLU' },
        { src: 'img/warrants/judicial-warrant-sample.png', es: 'Así se ve una orden JUDICIAL de un tribunal — la firma un juez e incluye tu nombre y dirección correctos.', en: 'This is what a JUDICIAL court warrant looks like — signed by a judge, with your correct name and address.', alt: 'Sample judicial search warrant from a United States District Court, annotated by the ACLU' },
      ], creditEs: 'Ejemplos anotados: ACLU de Carolina del Sur', creditEn: 'Annotated samples: ACLU of South Carolina' },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        { en: 'I do not consent to your entry.', es: 'No doy mi consentimiento para su entrada.', tone: 'best', reply: 'Exacto. Un Formulario I-200 lo firma un oficial de ICE, no un juez — no autoriza la entrada sin tu permiso.' },
        { en: 'Is that a judicial warrant signed by a judge, or an administrative warrant?', es: '¿Es esa una orden judicial firmada por un juez, o una orden administrativa?', tone: 'good', reply: 'También puedes preguntarlo primero. Saber qué tienes enfrente te ayuda a decidir con calma.' },
      ] },
      // NIJC explicitly extends the door-closed/ask-for-warrant protocol to
      // children (brief §2 Track B).
      // https://immigrantjustice.org/for-immigrants/know-your-rights/ice-encounter/
      // {name} is substituted at render time with the chosen guide's name
      // (see getGuide() above / scenario.tsx) — "juntos" here refers to the
      // family practicing together, NOT the guide's grammatical gender, so
      // it does not change with the guide pick.
      { t: 'tip', es: 'NIJC —una organización que apoya a familias inmigrantes— dice que este mismo protocolo también es para los niños. {name} sugiere: practiquen estas frases juntos en casa, como un juego tranquilo.', en: 'NIJC — an organization that supports immigrant families — says this same protocol extends to children too. {name} suggests: practice these lines together at home, like a calm game.' },
      // FLAGGED PER BRIEF §2 as a live, contested dispute — NOT settled law:
      // a reported 2025–2026 DHS memo asserts I-205 administrative warrants
      // authorize forced home entry against people with final removal
      // orders (per CNN/NBC/ABC/Protect Democracy reporting per verifier
      // notes; the memo claim itself was NOT independently verified in the
      // brief's research pass). The settled doctrine the memo is trying to
      // depart from is Payton v. New York (1980), per brief §2.
      { t: 'tip', es: 'Algo que debes saber, con calma: lo que acabas de aprender es la ley que sigue vigente. Ahora mismo, según se ha reportado en la prensa, un memo del gobierno intenta cambiar esa regla para ciertos casos, y está siendo disputado en las cortes. Por eso este protocolo —puerta cerrada, pedir un abogado— importa todavía más.', en: "Something worth knowing, calmly: what you just learned is still the settled law. Right now, news reports describe a government memo trying to change that rule for certain cases, and it's being challenged in court. That's why this protocol — door closed, ask for a lawyer — matters even more." },
      { t: 'speak', target: { en: 'I want to speak to a lawyer.', es: 'Quiero hablar con un abogado.' } },
      { t: 'recap', es: 'Lo hiciste con calma y claridad. La puerta cerrada y tu voz firme son tu protección — y ya sabes cómo practicarlo con tu familia.', learned: [
        { en: 'Which agency are you with?', es: '¿De qué agencia es usted?' },
        { en: 'Please slide the warrant under the door so I can read it.', es: 'Por favor, deslice la orden por debajo de la puerta para que la pueda leer.' },
        { en: 'I do not consent to your entry.', es: 'No doy mi consentimiento para su entrada.' },
        { en: 'I want to speak to a lawyer.', es: 'Quiero hablar con un abogado.' },
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
    { en: 'Which agency are you with?', es: '¿De qué agencia es usted?' }, // NILC May 2025 KYR — brief §1 Track B; also taught in casa/trabajo
    { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.' }, // ACLU KYR for immigrants (see RIGHTS above)
    { en: 'Am I free to go?', es: '¿Soy libre de irme?' }, // ACLU KYR for immigrants (see RIGHTS above)
  ] },
  { topic: 'clinica', items: [
    { en: 'I need to see a doctor.', es: 'Necesito ver a un doctor.' },
    { en: 'It hurts here.', es: 'Me duele aquí.' },
    { en: 'Can we talk about payment later?', es: '¿Podemos hablar del pago después?' },
  ] },
  // trabajo phrases re-added 2026-07-09 per docs/research/2026-07-encounter-reality-brief.md
  // §3 — both lines reuse the already-canonical ACLU-sourced wording (see
  // RIGHTS above), so no unsourced content was introduced.
  { topic: 'trabajo', items: [
    { en: 'I want to remain silent.', es: 'Quiero permanecer en silencio.' }, // ACLU KYR for immigrants (see RIGHTS above); brief §1/§3 Track B
    { en: 'I want to speak to a lawyer.', es: 'Quiero hablar con un abogado.' }, // ACLU KYR for immigrants (see RIGHTS above); judicial-warrant right extends to non-public workplace areas — brief §3 Track B
  ] },
  // casa phrases added 2026-07-09 per brief §2 (home/the door) — richest-sourced setting.
  { topic: 'casa', items: [
    { en: 'Which agency are you with?', es: '¿De qué agencia es usted?' }, // NILC May 2025 KYR — brief §2 Track B
    { en: 'Please slide the warrant under the door so I can read it.', es: 'Por favor, deslice la orden por debajo de la puerta para que la pueda leer.' }, // ILRC Red Card 2024 "slide-warrant" (src/content/phrases/core-rights.json) — brief §2 Track B
    { en: 'I do not consent to your entry.', es: 'No doy mi consentimiento para su entrada.' }, // AIC/NILC/ILRC/NIJC/ACLU-NC unanimous — brief §2 Track B
    { en: 'I want to speak to a lawyer.', es: 'Quiero hablar con un abogado.' }, // ACLU KYR for immigrants (see RIGHTS above)
  ] },
];

export const ONBOARDING: { emoji: string; title: string; body: string }[] = [
  { emoji: '🌅', title: 'El inglés que de verdad necesitas', body: 'Aprende a hablar en los momentos que importan — y conoce tus derechos en cada paso.' },
  { emoji: '📶', title: 'Funciona sin internet', body: 'Sin cuenta. Sin rastro. Todo vive en tu teléfono y nadie más lo ve.' },
  // body's {name} is substituted with the chosen guide's name at render
  // time (see Onboarding in screens.tsx) — this panel shows BEFORE the
  // guide-choice panel, so it always shows the default ('Tía Marisol')
  // there, which is fine: it's introducing the concept, not confirming it.
  { emoji: '💛', title: 'Tu guía, siempre contigo', body: '{name} te acompaña en cada situación, con calma y sin juzgar.' },
];

// ---- Prepárate: family-preparedness checklist ----------------------------
// A distinct hue from TOPICS — calm, not tied to any one encounter setting.
export const PREPARE_HUE = 200;

export interface PrepItem {
  id: string;
  icon: string;
  es: string;
  en: string;
}

// Sourcing basis: docs/research/2026-07-encounter-reality-brief.md
// "Cross-cutting: family preparedness" section — ILRC + United We Dream
// converge on all four items below (all sub-claims 3-0, high confidence).
// https://www.ilrc.org/community-resources/know-your-rights/step-step-family-preparedness-plan
// https://unitedwedream.org/resources/stay-ready-with-a-preparedness-packet/
// Framed as care, not fear, per the brief's tone section: preparation as an
// act of care for one's family.
export const PREP_ITEMS: PrepItem[] = [
  {
    id: 'a-number',
    icon: '🔢',
    es: 'Comparte tu número de extranjero (A-Number) con alguien de confianza, y guarda el enlace del localizador de detenidos de ICE.',
    en: "Share your A-Number with someone you trust, and save the link to ICE's online detainee locator.",
  },
  {
    id: 'packet',
    icon: '🗂️',
    es: 'Ten listo un paquete de preparación —documentos importantes, contactos, instrucciones— guardado bajo llave, donde ICE no pueda entrar.',
    en: 'Keep a preparedness packet — important documents, contacts, instructions — locked away where ICE cannot access it.',
  },
  {
    id: 'valid-docs',
    icon: '🪪',
    es: 'Lleva contigo prueba válida de tu estatus o tu permiso de trabajo. Nunca documentos falsos o de otro país.',
    en: 'Carry valid proof of your status or work permit with you. Never false documents or documents from another country.',
  },
  {
    id: 'emergency-contact',
    icon: '📞',
    es: 'Elige a una persona de emergencia que tenga tus contraseñas y las llaves de tu casa, por si acaso.',
    en: 'Choose one emergency contact who has your passcodes and house keys, just in case.',
  },
];

// ---- En Carolina del Norte: NC enforcement-law awareness section ---------
// Sourcing basis: docs/research/2026-07-nc-legislation-brief.md — the ONLY
// permitted source for this section (112-agent, 3-voter adversarial pass;
// black-letter statutory findings unanimous 3-0 against ncleg.gov). App rule
// carried from the brief: *what the law says* cites Track A (statute/
// journalism); *what to do about it* cites Track B (org guidance). Per the
// brief's "Do NOT claim in-app" list, this section deliberately excludes:
// DMV, public benefits, and courthouse-practice claims (no verified claims
// exist yet); a specific current count of 287(g) agreements (disputed,
// moving fast); HB 318 initial-passage vote tallies (refuted); and any
// discussion of the limits of HB 318's officer-immunity provision
// (unsourced, open legal question). Tone: name specifics calmly, pair every
// one with an action the app already teaches (La parada, the rights card,
// Prepárate) — never panic, per the brief's tone target.
export const NC_HUE = 285; // "corte" also uses 285, but corte is LOCKED and hidden — free to reuse publicly here.

// Marisol-voice framing line shown at the top of the section.
export const NC_INTRO: Phrase = {
  es: 'Las reglas cambiaron en Carolina del Norte. Conocerlas es protegerte.',
  en: 'The rules changed in North Carolina. Knowing them is protection.',
};

export interface NcCard {
  id: string;
  icon: string;
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
  /** Short "Fuente:" line — bill/case citation only, never a floor-vote detail. */
  source: string;
  action?: { labelEs: string; target: 'parada' | 'preparate' };
}

// Siembra NC's defense toolkit — plain URL per brief §"day-to-day" (Track B
// organizing link). The app is offline-only; this is a plain <a> the user
// may tap to leave the app in their own browser — nothing is fetched by the
// app itself. https://www.siembranc.org/en-toolkit/defend-yourself-from-ice-and-know-your-rights
export const NC_LINK_URL = 'https://www.siembranc.org/en-toolkit/defend-yourself-from-ice-and-know-your-rights';

export const NC_ITEMS: NcCard[] = [
  // Brief §3: SB 153 / SL 2026-19 ("NC Border Protection Act"), law since
  // Jun 24, 2026 — first NC law mandating formal 287(g) agreements, for four
  // STATE agencies incl. the State Highway Patrol (not county sheriffs).
  // Track B: Siembra NC toolkit reports arrests increasingly targeting
  // drivers. Action pairing: the app's own La parada scenario.
  {
    id: 'carretera',
    icon: '🚓',
    titleEs: 'En la carretera',
    titleEn: 'On the road',
    bodyEs: "Desde junio de 2026, una ley estatal obliga a la Patrulla de Caminos de Carolina del Norte y a otras agencias estatales a trabajar con ICE bajo acuerdos formales. Siembra NC reporta que los arrestos de inmigración están enfocándose cada vez más en personas mientras conducen. Lo que ya practicaste en “La parada” —cuerpo tranquilo, tus derechos en voz alta— importa aquí más que nunca.",
    bodyEn: "Since June 2026, a state law requires the North Carolina Highway Patrol and other state agencies to work with ICE under formal agreements. Siembra NC reports that immigration arrests are increasingly targeting people while they drive. What you already practiced in “A stop” — calm body, your rights spoken out loud — matters here more than ever.",
    source: 'Fuente: SB 153 / SL 2026-19 · Siembra NC',
    action: { labelEs: 'Practicar La parada →', target: 'parada' },
  },
  // Brief: HB 10 / SL 2024-55 (Dec 2024) broadened by HB 318 / SL 2025-85
  // (Oct 1, 2025) — being CHARGED (not convicted) of any felony or any
  // impaired-driving offense triggers a status check in every NC county
  // jail; 48-hour hold past scheduled release (HB 10 + HB 318). Action
  // pairing: rights-card phrases + Prepárate (already sourced to ILRC/UWD).
  {
    id: 'arresto',
    icon: '🔒',
    titleEs: 'Si te arrestan',
    titleEn: 'If you are arrested',
    // «ACUSADA|ACUSADO» / «condenada|condenado» — address-aware (owner
    // decision 2026-07-10); see AddressPref/resolveAddress above. Not
    // audible — NC card bodyEs is never passed to speak()/speakEs(), only
    // bodyEn (already gender-neutral English) is.
    bodyEs: 'En cada cárcel del condado en Carolina del Norte, ser «ACUSADA|ACUSADO» —no necesariamente «condenada|condenado»— de cualquier delito grave o de manejar bajo los efectos (DUI) activa, desde octubre de 2025, una verificación de estatus migratorio. Las cárceles deben mantener a la persona hasta 48 horas después de su hora de salida programada, para que ICE pueda recogerla. Las frases de tu tarjeta de derechos —silencio, un abogado— aplican en cada paso. Aquí es donde más importa haberte preparado: que alguien de confianza tenga tu número A y sepa qué hacer.',
    bodyEn: 'In every North Carolina county jail, being CHARGED — not necessarily convicted — with any felony or any impaired-driving offense has triggered an immigration-status check since October 2025. Jails must hold a person up to 48 hours past their scheduled release time so ICE can pick them up. The phrases on your rights card — silence, a lawyer — apply at every step. This is where being prepared matters most: someone you trust having your A-Number and knowing what to do.',
    source: 'Fuente: HB 10 / SL 2024-55 · HB 318 / SL 2025-85',
    action: { labelEs: 'Ir a Prepárate →', target: 'preparate' },
  },
  // Brief: HB10/HB318 sheriff-cooperation mandates apply statewide
  // regardless of 287(g) status (ACLU-NC 287(g) Toolkit, Mar 2026).
  // Deliberately no specific county count — on the do-not-claim list.
  {
    id: 'letreros',
    icon: '🪧',
    titleEs: 'Los letreros ya no dicen todo',
    titleEn: "Signs don't tell the whole story",
    bodyEs: 'Quizás hayas escuchado que solo algunos condados tienen acuerdos 287(g) con ICE. Eso ya no marca la diferencia que solía marcar: la cooperación de los alguaciles con ICE es obligatoria en todo el estado, tenga o no tu condado ese acuerdo formal. No asumas que donde vives es diferente.',
    bodyEn: "You may have heard that only some counties have 287(g) agreements with ICE. That no longer makes the difference it used to: sheriff cooperation with ICE is mandatory statewide, whether or not your county has that formal agreement. Don't assume where you live is different.",
    source: 'Fuente: HB 10 / SL 2024-55 · HB 318 / SL 2025-85 · ACLU-NC, Paquete 287(g) (mar. 2026)',
  },
  // Brief: Aceituno v. USDHS (filed Feb 24, 2026, W.D.N.C. 3:26-cv-00146;
  // ACLU-NC + ACLU + Democracy Forward + Southern Coalition for Social
  // Justice) challenges warrantless ICE/CBP arrests in NC — a federal
  // practice, not these state laws. Organizing link: Siembra NC (NC_LINK_URL above).
  {
    id: 'no-sola',
    icon: '🤝',
    // «sola|solo» — address-aware (owner decision 2026-07-10); not audible.
    titleEs: 'No estás «sola|solo»',
    titleEn: 'You are not alone',
    bodyEs: 'Una demanda federal colectiva —Aceituno v. USDHS, presentada en febrero de 2026 por ACLU-NC y organizaciones aliadas— está impugnando los arrestos de inmigración sin orden judicial en Carolina del Norte. Y las comunidades se organizan: el kit de defensa de Siembra NC está disponible en siembranc.org.',
    bodyEn: "A federal class-action lawsuit — Aceituno v. USDHS, filed in February 2026 by ACLU-NC and partner organizations — is challenging warrantless immigration arrests in North Carolina. And communities are organizing: Siembra NC's defense toolkit is available at siembranc.org.",
    source: 'Fuente: Aceituno v. USDHS, W.D.N.C. 3:26-cv-00146 (ACLU)',
  },
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
// MUST stay in sync with normalize() in scripts/generate-app-audio.py — the
// pre-generated audio manifest is keyed by this exact normalization.
export function normalizeSpoken(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFC')
    .replace(/[¿?¡!.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const SPANISH_AUDIO_BY_TEXT: Record<string, string> = {};
for (const p of coreRights.phrases) {
  SPANISH_AUDIO_BY_TEXT[normalizeSpoken(p.es)] = p.id;
}

/** Slug of a pre-generated public/audio/es/<slug>.mp3, if this exact Spanish phrase has one. */
export function spanishAudioSlug(es: string): string | undefined {
  return SPANISH_AUDIO_BY_TEXT[normalizeSpoken(es)];
}
