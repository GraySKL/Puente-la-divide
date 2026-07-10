#!/usr/bin/env python3
"""
generate-audio.py — Pre-generate Latin-American Spanish audio for the phrase deck.

WHY pre-generated (and not in-browser text-to-speech):
    The shipped app must NEVER make a network call (see CLAUDE.md threat model:
    no telemetry, no third-party endpoints, on-device only). Browser speech can
    silently route text to a cloud TTS server, which would leak that a vulnerable
    user is reading Know-Your-Rights material. So we render the audio ONCE, here,
    at build time, and commit the .mp3 files under public/audio/es/. At runtime the
    app only plays local files cached by the service worker — it phones nobody.

ENGINE:
    edge-tts (Microsoft neural voices). It contacts Microsoft ONLY when *you* run
    this script on your own machine — never from the shipped app. The voice is a
    Latin-American (Mexican) Spanish voice on purpose: the audience is NC immigrant
    communities (Siembra NC and similar), not Castilian speakers. If you'd rather
    the generator be 100% offline/open-source, swap edge-tts for Piper — nothing
    else in the app changes, because the app only depends on the output .mp3 files.

GUIDE VOICE PICK (2026-07-10): the app island (src/app/) now lets the user
    pick the guide's voice — Tía Marisol (default, this script's female pass,
    unchanged) or Tío Mateo (male). Mateo is always es-MX-JorgeNeural, the
    same voice generate-app-audio.py uses for the guide's app-level lines —
    the two generators must stay in sync (see that script's RULE comment).
    The male pass below writes to public/audio/es/male/<id>.mp3 and never
    touches the existing female files in public/audio/es/.

USAGE:
    python scripts/generate-audio.py                 # generate only missing files (both voices)
    python scripts/generate-audio.py --force         # regenerate everything (both voices)
    VOICE=es-US-PalomaNeural python scripts/generate-audio.py   # try another FEMALE voice

    Good Latin-American voices to try:
        es-MX-DaliaNeural (default, F)   es-MX-JorgeNeural (M, fixed — see above)
        es-US-PalomaNeural (F)           es-US-AlonsoNeural (M)
"""
import asyncio
import json
import os
import sys
from pathlib import Path

import edge_tts

# Print Spanish text safely regardless of the terminal's default code page.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
PHRASES = ROOT / "src" / "content" / "phrases" / "core-rights.json"
OUT_DIR = ROOT / "public" / "audio" / "es"
OUT_DIR_MALE = OUT_DIR / "male"
VOICE = os.environ.get("VOICE", "es-MX-DaliaNeural")
MALE_VOICE = "es-MX-JorgeNeural"  # Tío Mateo — fixed, not overridable via VOICE env


def to_speakable(text: str) -> str:
    """Turn an em-dash aside into a natural pause so it isn't mis-voiced."""
    return text.replace(" — ", ". ").replace("—", ". ")


async def main() -> int:
    force = "--force" in sys.argv
    data = json.loads(PHRASES.read_text(encoding="utf-8"))
    phrases = data["phrases"]
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR_MALE.mkdir(parents=True, exist_ok=True)

    made = skipped = 0
    for p in phrases:
        pid, text = p["id"], p["es"]
        out = OUT_DIR / f"{pid}.mp3"
        if out.exists() and not force:
            skipped += 1
        else:
            comm = edge_tts.Communicate(to_speakable(text), VOICE)
            await comm.save(str(out))
            made += 1
            print(f"  [ok] {pid}.mp3  ({VOICE})  -  {text}")

        # Tío Mateo pass — same phrases, fixed male voice, separate
        # directory. Never touches the female files generated above.
        male_out = OUT_DIR_MALE / f"{pid}.mp3"
        if male_out.exists() and not force:
            skipped += 1
            continue
        comm = edge_tts.Communicate(to_speakable(text), MALE_VOICE)
        await comm.save(str(male_out))
        made += 1
        print(f"  [ok] male/{pid}.mp3  ({MALE_VOICE})  -  {text}")

    print(
        f"\nDone. voice={VOICE}  male_voice={MALE_VOICE}  generated={made}  "
        f"skipped={skipped}  total={len(phrases) * 2}\n-> {OUT_DIR}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
