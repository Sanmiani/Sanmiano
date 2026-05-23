---
name: hyperframes
description: Use when authoring HyperFrames video compositions — HTML+GSAP structure, layout-before-animation workflow, timeline registration, quality gates, and non-negotiable rules
---

# HyperFrames

## Overview

HyperFrames is a framework for creating video compositions, animations, and multimedia content using HTML as the source of truth.

## What You Can Build

- Video compositions with synchronized clips and animations
- Title cards, overlays, and scene transitions
- Caption and subtitle sequences synced to audio
- Text-to-speech narration and voiceover integration
- Audio-reactive visuals (beat sync, glow effects, pulse animations)
- Animated text highlighting (markers, circles, scribbles)
- Multi-scene compositions with crossfades, wipes, reveals, and shader transitions

## Key Workflow Steps

**1. Design System** — Check for `design.md` (brand colors, fonts, constraints). If missing, either read a named style from `visual-styles.md`, use the design picker tool, or ask the user for mood/palette preferences and apply `house-style.md` defaults.

**2. Prompt Expansion** — Ground the request against design and house-style guidelines using the process in `references/prompt-expansion.md`.

**3. Plan Before Building** — Define narrative arc, structure (compositions and tracks), rhythm pattern, timing, layout, then animation.

**4. Layout First** — Position every element where it's most visible *before* adding motion. Build static HTML+CSS for the hero frame, then animate *from* offscreen *to* those positions using `gsap.from()`.

**5. Animation Rules** — Entrance animations on every element, transitions between all scenes, no exit animations except on the final scene, no repeat loops set to -1, timeline registration required.

## Non-Negotiable Rules

- Deterministic (no randomness or time-based logic)
- Only animate visual properties (opacity, position, scale, color)
- Never animate `visibility`, `display`, or call `play()`/`pause()`
- Register every timeline: `window.__timelines["<id>"] = tl`
- All timelines start `{ paused: true }`
- Build timelines synchronously (no async/await)
- Use separate `<audio>` for sound, not muted video

## Quality Checks

Run `npx hyperframes lint` and `validate` immediately. Then run `inspect` (layout audit) and `animation-map` (choreography verification) in parallel while previewing.

**Contrast audit:** `hyperframes validate` checks WCAG AA compliance; fix failing colors to meet 4.5:1 ratio.

**Design adherence:** Verify all colors and fonts match `design.md`, no invented values.

## Quick Reference

| Rule | Detail |
|---|---|
| Timeline registration | `window.__timelines["<id>"] = tl` |
| Start state | `{ paused: true }` |
| Layout principle | Position first, animate from offscreen |
| Entrance animations | Every element needs one |
| Exit animations | Only on final scene |
| Repeat | Never `repeat: -1` |
| Sound | Separate `<audio>` element, not muted video |
| Lint | `npx hyperframes lint` before preview |
| Validate | `npx hyperframes validate` before render |
