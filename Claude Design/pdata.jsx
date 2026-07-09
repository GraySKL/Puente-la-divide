// pdata.jsx — content for the Puente interactive app.
// Tone: conversational but thorough, calm, bilingual, rights woven in.
// NOTE: illustrative content — final rights wording should be reviewed by an
// immigration legal org before shipping.

const APP_TOPICS = ['parada', 'clinica', 'trabajo', 'casa', 'escuela', 'corte'];
const LOCKED = { trabajo: true, casa: true, escuela: true, corte: true };

const SCENARIOS = {
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
        { en: 'Why did you stop me?', es: '¿Por qué me detuvo?', tone: 'good', reply: 'Puedes preguntarlo, con calma y respeto. Tienes derecho a saber el motivo.' },
      ] },
      { t: 'say', who: 'El oficial', en: 'Where were you born?', es: '¿Dónde nació usted?' },
      { t: 'tip', es: 'Esta pregunta es sobre tu estatus migratorio. No tienes que responderla. Puedes guardar silencio, con respeto.', en: 'You do not have to answer questions about your immigration status.', phrase: 'I want to remain silent.' },
      { t: 'speak', target: { en: 'I want to remain silent.', es: 'Quiero guardar silencio.' } },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        { en: 'I prefer not to answer.', es: 'Prefiero no responder.', tone: 'good', reply: 'Cortés y firme. Proteges tu derecho sin levantar tensión.' },
        { en: 'I want to remain silent.', es: 'Quiero guardar silencio.', tone: 'best', reply: 'Esa frase es tu derecho. Puedes repetirla con calma las veces que necesites.' },
      ] },
      { t: 'say', who: 'El oficial', en: 'Are you a citizen?', es: '¿Es usted ciudadano?' },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        { en: 'I want to remain silent.', es: 'Quiero guardar silencio.', tone: 'best', reply: 'Bien. No tienes que hablar de tu estatus con nadie en la calle.' },
        { en: 'Am I free to go?', es: '¿Puedo irme?', tone: 'good', reply: 'Buena pregunta. Si te dicen que sí, puedes irte con calma. Si no, sigues en silencio.' },
      ] },
      { t: 'speak', target: { en: 'Am I free to go?', es: '¿Puedo irme?' } },
      { t: 'recap', es: 'Lo hiciste muy bien, Rosa. Estas frases ya son tuyas — guárdalas en el bolsillo.', learned: [
        { en: 'Here you are, officer.', es: 'Aquí tiene, oficial.' },
        { en: 'I want to remain silent.', es: 'Quiero guardar silencio.' },
        { en: 'Am I free to go?', es: '¿Puedo irme?' },
      ] },
    ],
  },
  clinica: {
    key: 'clinica',
    title: 'La clínica',
    en: 'The clinic',
    blurb: 'Pedir atención médica con claridad — y sin miedo a tu estatus.',
    minutes: 3,
    steps: [
      { t: 'scene', emoji: '🏥', es: 'Llegas a la sala de emergencias. La recepcionista te saluda desde el mostrador.' },
      { t: 'tip', es: 'Puedes recibir atención de emergencia sin importar tu estatus migratorio. No están obligados a preguntarlo para atenderte.', en: 'You can get emergency care regardless of your immigration status.' },
      { t: 'say', who: 'Recepción', en: 'Do you have insurance?', es: '¿Tiene seguro médico?' },
      { t: 'choose', prompt: '¿Qué dices?', options: [
        { en: "I don't have insurance.", es: 'No tengo seguro.', tone: 'good', reply: 'Está bien decirlo. En una emergencia te deben atender de todos modos.' },
        { en: 'Can we talk about payment later?', es: '¿Podemos hablar del pago después?', tone: 'best', reply: 'Sí. Primero tu salud; el pago casi siempre se puede arreglar después.' },
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

// quick rights statements for the panic card
const RIGHTS = [
  { en: 'I want to remain silent.', es: 'Quiero guardar silencio.' },
  { en: 'I do not consent to a search.', es: 'No doy mi consentimiento para una revisión.' },
  { en: 'I want to speak to a lawyer.', es: 'Quiero hablar con un abogado.' },
  { en: 'Am I free to go?', es: '¿Puedo irme?' },
  { en: 'I do not wish to answer questions.', es: 'No deseo responder preguntas.' },
];

const PHRASES = [
  { topic: 'parada', items: [
    { en: 'Here you are, officer.', es: 'Aquí tiene, oficial.' },
    { en: 'I want to remain silent.', es: 'Quiero guardar silencio.' },
    { en: 'Am I free to go?', es: '¿Puedo irme?' },
  ] },
  { topic: 'clinica', items: [
    { en: 'I need to see a doctor.', es: 'Necesito ver a un doctor.' },
    { en: 'It hurts here.', es: 'Me duele aquí.' },
    { en: 'Can we talk about payment later?', es: '¿Podemos hablar del pago después?' },
  ] },
  { topic: 'trabajo', items: [
    { en: 'I have not been paid.', es: 'No me han pagado.' },
    { en: 'This is not safe.', es: 'Esto no es seguro.' },
  ] },
];

const ONBOARDING = [
  { emoji: '🌅', title: 'El inglés que de verdad necesitas', body: 'Aprende a hablar en los momentos que importan — y conoce tus derechos en cada paso.' },
  { emoji: '📶', title: 'Funciona sin internet', body: 'Sin cuenta. Sin rastro. Todo vive en tu teléfono y nadie más lo ve.' },
  { emoji: '💛', title: 'Tu guía, siempre contigo', body: 'Tía Marisol te acompaña en cada situación, con calma y sin juzgar.' },
];

Object.assign(window, { APP_TOPICS, LOCKED, SCENARIOS, RIGHTS, PHRASES, ONBOARDING });
