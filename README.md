# ForgeShield OT Security — Frontend + UX Design Challenge

This is a focused high-fidelity desktop-first React/Vite prototype for the Industrial Cybersecurity Platform challenge.

## Included
- Main Dashboard
- Attack Path Map
- Investigation side panel for selected asset/node
- Global site, time and severity filters
- Search entry points
- Drill-down navigation from dashboard to attack-path workspace
- Risk/findings, asset visibility, attack-path preview, topology insight, recent changes and platform health
- Explicit degraded-data messaging
- Explicit uncertainty/confidence cues
- Large-graph controls: zoom, fit, search, severity/zone filters, single/multi-path toggle, legend and minimap
- Keyboard-visible focus states and non-colour status cues
- Responsive adaptation
- Orange / black / white visual direction with restrained supporting colours
- No proprietary product internals

## Run
```bash
npm install
npm run dev
```

Build:
```bash
npm run build
```

## Challenge mapping
1. Dashboard answers posture, urgency, recent changes, priority assets/risks, exposed critical assets and attack paths above the fold.
2. Attack Path Map shows source, pivots, target, directed relationships, protocol, risk, confidence and evidence.
3. Investigation panel preserves graph position and includes summary, why it matters, evidence, weaknesses/findings context, protocol/zone context, related investigation actions and deeper-view actions.
4. Functional states are represented through healthy, high-risk, degraded, uncertain and empty-selection patterns.
5. Accessibility: visible focus, readable hierarchy, labels, legends and status cues that do not depend on colour alone.
6. Design rationale is provided separately in `DESIGN_RATIONALE.md`.

Data is illustrative and intentionally does not claim to reproduce proprietary detection logic.
