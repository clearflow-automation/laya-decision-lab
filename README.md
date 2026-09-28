# Laya Decision Lab — public draft

Static, shareable showcase of the Laya Snake experiment. The page is ready for local review. **Publication is pending Nandit's review.**

## What visitors see

- A browser replay of three real local Laya Snake runs (seeds 19, 42, and 7), with play, pause, step, seek, and speed controls.
- Recorded board states, per-direction model scores, proposed and executed moves, and inference time for every move.
- Four short findings about the role of structured action descriptions, the bounded game result, a separate scorer-adaptation pilot, and a separate historical-context pilot.
- A short Jev/trading research roadmap and a clear link to Airlantern.

**No Laya model runs in the visitor's browser.** This site does not offer a fresh interactive inference session. The game used the pretrained local checkpoint with planner hints; the weight-adaptation and historical-context findings came from separate trading research pilots. The 120-move cap is not a win condition.

## Sources and attribution

- Community game and policy: https://github.com/zzhdbw/laya-Ascend (`examples/snake`), Apache 2.0. Its policy itself references the AXERA Snake example.
- Laya Python package: https://github.com/NandhaKishorM/laya, Apache 2.0.
- Local run record: `../outputs/community-snake-comparison.json`. `runs.js` is a reduced, public-safe extraction of the three guarded runs. It contains only game board states and decision metadata.
- Separate training finding: local historical research report `ENTRY_TRAINING_RESULT.md`.
- Separate context finding: local historical research report `ORACLE_EVIDENCE_RESULT.md`.

The included `LICENSE` is the community project's Apache 2.0 text. Keep attribution links and provenance with any published version.

## Local preview

Run `python3 -m http.server 8433` inside this directory, then open `http://127.0.0.1:8433/`.

For a later GitHub Pages deployment, copy this directory into a dedicated public repository or its Pages source folder. Do not publish the private research repositories, raw trading data, or local credentials.
