---
name: website-to-hyperframes
description: Use when the user provides a website URL and requests any video content from it — product demos, social ads, feature announcements, brand reels, or launch teasers converted to HyperFrames compositions
---

# Website to HyperFrames

7-step workflow for converting websites into professional videos using HyperFrames.

## When to Use

Activate when users provide a URL and request any video content — product demos, social ads, feature announcements, brand reels, or launch teasers.

## The Workflow

### Step 1: Capture & Understand

Read the website. Extract key data:
- Brand colors (hex values from CSS or design system)
- Typography (font families, weights, sizes)
- Key assets (logos, product images, screenshots)
- Brand voice and messaging

Summarize the brand identity in a short paragraph.

### Step 2: Design Reference

Create `DESIGN.md` — a ~90-line brand cheat sheet covering:
- Color palette (primary, secondary, accent, background, text)
- Typography stack and scale
- Spacing and layout principles
- Logo and asset usage rules
- Visual style notes (dark/light mode, illustration style, photography)

### Step 3: Narration Script

Write `SCRIPT.md` with the story backbone. Scene lengths flow from narration timing, not assumptions.

- One sentence per beat
- Include intended duration for each scene
- Total runtime target: 30s / 60s / 90s (confirm with user)

### Step 4: Storyboard

Produce `STORYBOARD.md` with beat-by-beat creative direction:
- Mood and visual treatment per scene
- Camera work (zoom, pan, reveal direction)
- Animation cues (what enters, when, how)
- Transition types between scenes
- Audio cues (music mood, TTS voice)

Update scene durations to match narration timing from Step 3.

### Step 5: Voice & Timing

```bash
npx hyperframes tts SCRIPT.md --voice af_heart --output narration.wav
npx hyperframes transcribe narration.wav   # → transcript.json
```

- Map word-level timestamps to storyboard beats
- Update `STORYBOARD.md` with precise durations from transcript
- Adjust scene boundaries to hit natural speech pauses

See the `hyperframes-media` skill for voice selection guidance.

### Step 6: Build Compositions

Construct each composition per storyboard specs:

1. Scaffold: `npx hyperframes init my-brand-video`
2. Build each scene as a composition with correct `data-start`, `data-duration`, `data-track-index`
3. Self-review checklist:
   - Layout matches storyboard (static frame before animation)
   - Assets placed at correct z-index
   - Entrance animation on every element
   - GSAP timeline registered: `window.__timelines["<id>"] = tl`
   - Colors and fonts match `DESIGN.md`

### Step 7: Validate & Deliver

```bash
npx hyperframes lint
npx hyperframes validate
npx hyperframes inspect
npx hyperframes preview
```

Share the active Studio project URL with the user (not `index.html`):

```text
http://localhost:<port>/#project/<project-name>
```

For final delivery:

```bash
npx hyperframes render --quality high --output final.mp4
```

## Quick Reference

| Step | Output |
|---|---|
| 1. Capture | Brand identity summary |
| 2. Design | `DESIGN.md` (~90 lines) |
| 3. Script | `SCRIPT.md` with scene durations |
| 4. Storyboard | `STORYBOARD.md` with beat-by-beat direction |
| 5. Voice & Timing | `narration.wav` + `transcript.json` |
| 6. Build | `index.html` + composition files |
| 7. Validate | Studio URL + `final.mp4` |
