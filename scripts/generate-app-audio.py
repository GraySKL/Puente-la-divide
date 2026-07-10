#!/usr/bin/env python3
"""
generate-app-audio.py — Pre-generate neural audio for every audible line in the
app island (src/app/data.ts), with a distinct voice per character.

WHY pre-generated: same threat-model reason as generate-audio.py — the shipped
app must NEVER make a network call. edge-tts contacts Microsoft only when YOU
run this script; the app just plays the committed local mp3s (service-worker
precached, fully offline).

VOICE CASTING (distinct, natural voices per speaker):
    Tía Marisol / guide, Spanish (F) .. es-MX-DaliaNeural   (warm MX Spanish)
    Tío Mateo / guide, Spanish (M) .... es-MX-JorgeNeural   (warm MX Spanish)
    El oficial ......................... en-US-ChristopherNeural (male, measured)
    Recepcion (clinic) ................. en-US-AriaNeural    (female, friendly)
    Learner practice lines (EN, F) ..... en-US-JennyNeural at -8% (clear, unhurried)
    Learner practice lines (EN, M) ..... en-US-AndrewNeural at same rate (warm,
        conversational — deliberately NOT en-US-GuyNeural: Microsoft classes
        Guy in the same "News/Novel" announcer category as Christopher
        (officer), so it risks reading as the same speaker. Andrew is in the
        "Conversation/Copilot" family instead, with no category overlap with
        any fixed character voice. See RULE below.

    RULE (owner, 2026-07-10, extended 2026-07-10 for the guide voice pick):
    learner voices must never match or resemble any character voice, AND the
    two guide voices (Marisol/Mateo) must stay distinct from every other cast
    voice too. A learning ear needs to reliably tell "the other person
    talking to me" (officer/receptionist/guide/Aria narration) apart from "my
    own lines" (the learner voice, F or M) — and the guide itself must be
    unmistakable regardless of which guide or which learner voice is picked.
    es-MX-JorgeNeural is the only es-MX male voice in play, with zero name/
    style overlap with Dalia (guide, F), Jenny/Andrew (learner, EN), Aria
    (receptionist, EN), or Christopher (officer, EN) — different language
    from all the EN voices, different person from Dalia. This constrains any
    future re-casting of any character voice or either learner/guide voice.

OUTPUT:
    public/audio/en/<slug>.mp3, public/audio/es/<slug>.mp3
    public/audio/en/male/<slug>.mp3 — male variant of every LEARNER line
    public/audio/es/male/<slug>.mp3 — Tío Mateo variant of every MARISOL
        (guide) line — character lines (officer, receptionist) never get one
    src/app/audio-manifest.json — { "en", "en_male", "es", "es_male" }, each a
    map of <normalized text> -> "<lang>/<slug>.mp3". en_male/es_male contain
    ONLY learner/guide lines respectively (never fixed character lines) —
    see RULE above.
    The app matches by exact normalized text (see normalizeSpoken in data.ts —
    the normalize() below MUST stay in sync with it).

DRIFT GUARD:
    Every line below must appear VERBATIM in src/app/data.ts. If content
    changes there, this script fails loudly instead of shipping stale audio.

USAGE:
    python scripts/generate-app-audio.py            # only missing files
    python scripts/generate-app-audio.py --force    # regenerate everything
"""
import asyncio
import json
import sys
import unicodedata
from pathlib import Path

import edge_tts

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
DATA_TS = ROOT / "src" / "app" / "data.ts"
AUDIO_DIR = ROOT / "public" / "audio"
MANIFEST = ROOT / "src" / "app" / "audio-manifest.json"

MARISOL = "es-MX-DaliaNeural"
OFICIAL = "en-US-ChristopherNeural"
RECEPCION = "en-US-AriaNeural"
LEARNER = "en-US-JennyNeural"
LEARNER_MALE = "en-US-AndrewNeural"  # see RULE in the module docstring
MATEO = "es-MX-JorgeNeural"  # Tío Mateo — guide voice, male; see RULE

# Voices that get a second-cast "opposite" variant, and where it's written.
# LEARNER -> en/male (the learner's own lines, F/M pref, see ui.tsx VoicePref)
# MARISOL -> es/male (the guide's lines, Marisol/Mateo pref, see ui.tsx GuidePref)
SECOND_CAST = {
    LEARNER: (LEARNER_MALE, "en", "en_male"),
    MARISOL: (MATEO, "es", "es_male"),
}

# (slug, lang, voice, rate, text) — text must match src/app/data.ts verbatim.
LINES = [
    # --- La parada: officer dialogue ---
    ("officer-license", "en", OFICIAL, "+0%", "License and registration, please."),
    ("officer-born", "en", OFICIAL, "+0%", "Where were you born?"),
    ("officer-citizen", "en", OFICIAL, "+0%", "Are you a citizen?"),
    # --- La clinica: receptionist dialogue ---
    ("reception-insurance", "en", RECEPCION, "+0%", "Do you have insurance?"),
    ("reception-brings", "en", RECEPCION, "+0%", "What brings you in today?"),
    # --- Learner lines: choices, practice targets, rights card, phrasebook ---
    ("learner-here-you-are", "en", LEARNER, "-8%", "Here you are, officer."),
    ("learner-why-stop", "en", LEARNER, "-8%", "Why did you stop me?"),
    ("learner-prefer-not", "en", LEARNER, "-8%", "I prefer not to answer."),
    ("learner-remain-silent", "en", LEARNER, "-8%", "I want to remain silent."),
    ("learner-free-to-go", "en", LEARNER, "-8%", "Am I free to go?"),
    ("learner-no-insurance", "en", LEARNER, "-8%", "I don't have insurance."),
    ("learner-payment-later", "en", LEARNER, "-8%", "Can we talk about payment later?"),
    ("learner-chest-pain", "en", LEARNER, "-8%", "I have strong chest pain."),
    ("learner-see-doctor-please", "en", LEARNER, "-8%", "I need to see a doctor, please."),
    ("learner-see-doctor", "en", LEARNER, "-8%", "I need to see a doctor."),
    ("learner-hurts-here", "en", LEARNER, "-8%", "It hurts here."),
    ("learner-no-consent-search", "en", LEARNER, "-8%", "I do not consent to a search."),
    ("learner-speak-lawyer", "en", LEARNER, "-8%", "I want to speak to a lawyer."),
    ("learner-no-answer-questions", "en", LEARNER, "-8%", "I do not wish to answer questions."),
    # --- Spanish phrasebook lines without a core-rights.json clip ---
    ("app-aqui-tiene", "es", MARISOL, "+0%", "Aquí tiene, oficial."),
    ("app-ver-doctor", "es", MARISOL, "+0%", "Necesito ver a un doctor."),
    ("app-me-duele", "es", MARISOL, "+0%", "Me duele aquí."),
    ("app-pago-despues", "es", MARISOL, "+0%", "¿Podemos hablar del pago después?"),
    # --- La casa / deepened parada (added 2026-07-09, post content-vet) ---
    ("voice-outside-police", "en", OFICIAL, "+0%", "Police! Open the door."),
    ("learner-which-agency", "en", LEARNER, "-8%", "Which agency are you with?"),
    ("learner-slide-warrant", "en", LEARNER, "-8%", "Please slide the warrant under the door so I can read it."),
    ("learner-no-consent-entry", "en", LEARNER, "-8%", "I do not consent to your entry."),
    ("learner-judicial-or-admin", "en", LEARNER, "-8%", "Is that a judicial warrant signed by a judge, or an administrative warrant?"),
    ("app-que-agencia", "es", MARISOL, "+0%", "¿De qué agencia es usted?"),
    ("app-no-consent-entrada", "es", MARISOL, "+0%", "No doy mi consentimiento para su entrada."),
    # --- En Carolina del Norte cards (EN mirrors, tap-to-hear) ---
    ("nc-intro", "en", RECEPCION, "+0%", "The rules changed in North Carolina. Knowing them is protection."),
    ("nc-carretera", "en", RECEPCION, "+0%", "Since June 2026, a state law requires the North Carolina Highway Patrol and other state agencies to work with ICE under formal agreements. Siembra NC reports that immigration arrests are increasingly targeting people while they drive. What you already practiced in “A stop” — calm body, your rights spoken out loud — matters here more than ever."),
    ("nc-arresto", "en", RECEPCION, "+0%", "In every North Carolina county jail, being CHARGED — not necessarily convicted — with any felony or any impaired-driving offense has triggered an immigration-status check since October 2025. Jails must hold a person up to 48 hours past their scheduled release time so ICE can pick them up. The phrases on your rights card — silence, a lawyer — apply at every step. This is where being prepared matters most: someone you trust having your A-Number and knowing what to do."),
    ("nc-letreros", "en", RECEPCION, "+0%", "You may have heard that only some counties have 287(g) agreements with ICE. That no longer makes the difference it used to: sheriff cooperation with ICE is mandatory statewide, whether or not your county has that formal agreement. Don't assume where you live is different."),
    ("nc-no-sola", "en", RECEPCION, "+0%", "A federal class-action lawsuit — Aceituno v. USDHS, filed in February 2026 by ACLU-NC and partner organizations — is challenging warrantless immigration arrests in North Carolina. And communities are organizing: Siembra NC's defense toolkit is available at siembranc.org."),
    # --- Prepárate checklist EN mirrors (tap-to-hear) ---
    ("prep-a-number", "en", RECEPCION, "+0%", "Share your A-Number with someone you trust, and save the link to ICE's online detainee locator."),
    ("prep-packet", "en", RECEPCION, "+0%", "Keep a preparedness packet — important documents, contacts, instructions — locked away where ICE cannot access it."),
    ("prep-valid-docs", "en", RECEPCION, "+0%", "Carry valid proof of your status or work permit with you. Never false documents or documents from another country."),
    ("prep-contact", "en", RECEPCION, "+0%", "Choose one emergency contact who has your passcodes and house keys, just in case."),
]


def to_speakable(text: str) -> str:
    """Turn an em-dash aside into a natural pause so it isn't mis-voiced."""
    return text.replace(" — ", ". ").replace("—", ". ")


def normalize(text: str) -> str:
    """MUST mirror normalizeSpoken() in src/app/data.ts exactly."""
    t = unicodedata.normalize("NFC", text.lower())
    for ch in "¿?¡!.,":
        t = t.replace(ch, "")
    return " ".join(t.split())


async def main() -> int:
    force = "--force" in sys.argv
    source = DATA_TS.read_text(encoding="utf-8")

    drift = [slug for slug, _, _, _, text in LINES if text not in source]
    if drift:
        print("DRIFT: these lines no longer appear verbatim in data.ts:")
        for slug in drift:
            print(f"  - {slug}")
        print("Update LINES above to match data.ts, then re-run.")
        return 1

    manifest: dict[str, dict[str, str]] = {"en": {}, "en_male": {}, "es": {}, "es_male": {}}
    made = skipped = 0
    for slug, lang, voice, rate, text in LINES:
        out_dir = AUDIO_DIR / lang
        out_dir.mkdir(parents=True, exist_ok=True)
        out = out_dir / f"{slug}.mp3"
        manifest[lang][normalize(text)] = f"{lang}/{slug}.mp3"
        if out.exists() and not force:
            skipped += 1
        else:
            comm = edge_tts.Communicate(to_speakable(text), voice, rate=rate)
            await comm.save(str(out))
            made += 1
            print(f"  [ok] {lang}/{slug}.mp3  ({voice})  -  {text}")

        # Second-cast variant (learner M, or guide Mateo) — only for voices
        # in SECOND_CAST. Fixed character voices (officer, receptionist)
        # never get one, so they can never be re-voiced by a preference.
        cast = SECOND_CAST.get(voice)
        if cast:
            cast_voice, cast_lang, manifest_key = cast
            cast_dir = AUDIO_DIR / cast_lang / "male"
            cast_dir.mkdir(parents=True, exist_ok=True)
            cast_out = cast_dir / f"{slug}.mp3"
            manifest[manifest_key][normalize(text)] = f"{cast_lang}/male/{slug}.mp3"
            if cast_out.exists() and not force:
                skipped += 1
                continue
            comm = edge_tts.Communicate(to_speakable(text), cast_voice, rate=rate)
            await comm.save(str(cast_out))
            made += 1
            print(f"  [ok] {cast_lang}/male/{slug}.mp3  ({cast_voice})  -  {text}")

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nDone. generated={made} skipped={skipped} total={len(LINES)}\n-> {MANIFEST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
