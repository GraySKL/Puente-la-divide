export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

export const STRINGS = {
  en: {
    siteName: 'Puente / Bridge',
    tagline: 'Know your rights. Speak the words. In English and Spanish.',
    chooseLanguage: 'Choose your language',
    iSpeakEnglish: "I speak English — I'm here to help",
    iSpeakSpanish: 'Hablo español — quiero aprender mis derechos',
    nav: {
      home: 'Home',
      scenarios: 'Scenarios',
      practice: 'Practice phrases',
      switchLang: 'Español'
    },
    sections: {
      scenariosTitle: 'ICE-encounter scenarios',
      scenariosLead:
        'Five common situations. What your rights are. The exact words to say — in Spanish.',
      practiceTitle: 'Phrase practice',
      practiceLead:
        'A short deck of the phrases that matter most. Practice until they come out without thinking.'
    },
    disclaimer:
      'This is general information, not legal advice. For your situation, contact a lawyer.',
    sourcedFrom: 'Sourced from',
    learnMore: 'Learn more',
    next: 'Next',
    previous: 'Previous',
    flip: 'Tap to see translation',
    showSource: 'Show source',
    hideSource: 'Hide source'
  },
  es: {
    siteName: 'Puente / Bridge',
    tagline: 'Conozca sus derechos. Diga las palabras. En inglés y español.',
    chooseLanguage: 'Elija su idioma',
    iSpeakEnglish: 'I speak English — I want to help',
    iSpeakSpanish: 'Hablo español — quiero aprender mis derechos',
    nav: {
      home: 'Inicio',
      scenarios: 'Escenarios',
      practice: 'Practicar frases',
      switchLang: 'English'
    },
    sections: {
      scenariosTitle: 'Encuentros con ICE',
      scenariosLead:
        'Cinco situaciones comunes. Cuáles son sus derechos. Las palabras exactas que decir — en inglés.',
      practiceTitle: 'Práctica de frases',
      practiceLead:
        'Una baraja corta de las frases más importantes. Practique hasta que salgan sin pensar.'
    },
    disclaimer:
      'Esto es información general, no asesoría legal. Para su situación, consulte a un abogado.',
    sourcedFrom: 'Fuente',
    learnMore: 'Saber más',
    next: 'Siguiente',
    previous: 'Anterior',
    flip: 'Toque para ver la traducción',
    showSource: 'Ver fuente',
    hideSource: 'Ocultar fuente'
  }
} as const satisfies Record<Locale, unknown>;

export function t(locale: Locale) {
  return STRINGS[locale];
}
