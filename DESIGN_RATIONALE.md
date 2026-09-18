# Design Rationale

## 1. Information prioritisation
The dashboard uses a strict top-to-bottom hierarchy:
1. Security posture and monitoring quality.
2. Open risk and critical exposure.
3. Asset visibility.
4. Attack-path preview.
5. Network relationships and recent changes.
6. Sensor/platform health.

The first screen therefore supports the challenge's 5–10 second questions without attempting to show every metric.

## 2. Leadership + analyst workflows
Leadership can immediately see posture score, critical assets, exposed critical assets, open findings, attack-path count and trend.
Analysts can use the same surface to move from KPI → finding/path → investigation workspace. The Attack Paths navigation then provides graph controls, path metadata and evidence without forcing a context switch.

## 3. Preventing graph overload
The map defaults to a single selected path. Search, severity, zone and single/multi-path controls reduce visible complexity. Nodes expose essential context directly while deeper evidence stays in the side panel. A legend, minimap, fit control and relationship labels support navigation. Suspicious relationships use a dashed visual treatment and directional arrows.

## 4. Uncertainty and incomplete data
The interface explicitly states when monitoring is degraded and warns that conclusions may be incomplete. Confidence is textual rather than colour-only. The graph rationale treats low-confidence relationships as uncertain rather than confirmed movement.

## 5. Scaling to large environments
The graph uses progressive disclosure concepts: single-path focus, filtering, grouping-ready controls, minimap and fit-to-view. The dashboard uses summaries rather than rendering thousands of relationships.

## 6. Accessibility
The visual system does not rely only on colour: severity has text labels and icons; risky edges are dashed and directional; selected states use borders/focus; controls have labels/ARIA labels; keyboard focus is visible; charts include textual legends.

## 7. Assumptions
Because the challenge intentionally withholds proprietary architecture and detection logic, the prototype uses illustrative OT assets, protocols, findings and relationships only. It does not imply these represent the real platform.

## 8. Visual direction
Orange, black and white form the base palette. Supporting muted colours are used sparingly for severity, health and uncertainty. The design intentionally avoids neon hacker aesthetics, excessive 3D effects and decoration that would compete with operational information.

## 9. States represented
- Normal/healthy: green health indicators and current data.
- High risk: explicit Critical/High labels and evidence.
- Degraded: collection status and freshness warning.
- Unknown/uncertain: confidence and incomplete-data messaging.
- Empty: selected-node empty state.
- Large volume: filters, fit, minimap and single/multi-path controls.
- Action feedback: investigation controls are visually distinct from destructive actions; no destructive action is included in this focused challenge scope.
