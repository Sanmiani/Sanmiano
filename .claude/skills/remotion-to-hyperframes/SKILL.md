---
name: remotion-to-hyperframes
description: Use when explicitly asked to port, convert, migrate, or translate a Remotion React composition to HyperFrames HTML format — not for new compositions or when Remotion appears as passing reference
---

# Remotion to HyperFrames

Specialized translation tool for migrating React-based Remotion video compositions to HyperFrames (HTML + GSAP) format.

## When to Activate

**Activate ONLY when the user explicitly says:** "port", "convert", "migrate", or "translate" a Remotion composition to HyperFrames.

**Do NOT activate when:**
- Building a new HyperFrames composition from scratch
- Remotion appears as passing reference material
- User asks for similar output without requesting source migration

## Core Workflow

### Step 1: Lint Detection

Scan for blockers that prevent clean translation:

**Blockers (halt work):**
- `useState` driving animation state
- `useEffect` with side effects
- Async `calculateMetadata`
- Third-party React libraries with no HTML equivalent

**Warnings (allow conditional translation):**
- Complex `interpolate()` chains
- Custom hooks that can be flattened

### Step 2: API Mapping

Cross-reference Remotion constructs against HyperFrames equivalents:

| Remotion | HyperFrames |
|---|---|
| `<Sequence from={f} durationInFrames={d}>` | `data-start` and `data-duration` attributes |
| `useCurrentFrame()` | GSAP timeline position |
| `interpolate(frame, [...], [...])` | `gsap.fromTo()` with explicit values |
| `<Video src>` | `<video data-start data-duration>` |
| `<Audio src>` | `<audio>` element |
| `fps` | `--fps` render flag |
| `<Lottie>` | `lottie-web` pattern (see `lottie` skill) |

### Step 3: HTML Generation

Produce `index.html` with:
- Root stage div
- Scene elements with `data-composition-id`, `data-start`, `data-duration`, `data-track-index`
- Inline CSS for layout and styling
- Single GSAP timeline registered to `window.__timelines["<composition-id>"]`

### Step 4: Validation

```bash
npx hyperframes lint
npx hyperframes validate
npx hyperframes inspect
```

Run SSIM image-diff tests against measured baselines (~0.02 tolerance below source complexity tier).

### Step 5: Documentation

Capture any lossy translation gaps in `TRANSLATION_NOTES.md`.

## Critical Limitation

Compositions that drive animation via `useState` + `useEffect` are not deterministic frame-capture targets in HyperFrames' seek-driven model. For such cases, recommend runtime interop instead of forcing a translation.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Translating `useState`-driven animations | Halt and recommend runtime interop |
| Using Remotion's frame count directly | Convert: `frame / fps = seconds` |
| Keeping React-style component structure | Flatten to static HTML + GSAP |
| Missing `data-track-index` on overlapping scenes | All overlapping elements need explicit z-ordering |
