---
name: hyperframes-media
description: Use when generating TTS audio, transcribing audio/video to word-level timestamps, or removing backgrounds from video — covers voice selection, Whisper model rules, output format choice, and the TTS → transcribe → captions chain
---

# HyperFrames Media Preprocessing

Three CLI commands that produce assets for compositions: `tts` (speech), `transcribe` (timestamps), and `remove-background` (transparent video). Each downloads a model on first run and caches it under `~/.cache/hyperframes/`.

## Text-to-Speech (`tts`)

Generate speech audio locally with Kokoro-82M. No API key.

```bash
npx hyperframes tts "Text here" --voice af_nova --output narration.wav
npx hyperframes tts script.txt --voice bf_emma --output narration.wav
npx hyperframes tts --list                       # all 54 voices
```

### Voice Selection

Match voice to content. Default is `af_heart`.

| Content type | Voice | Why |
|---|---|---|
| Product demo | `af_heart`/`af_nova` | Warm, professional |
| Tutorial / how-to | `am_adam`/`bf_emma` | Neutral, easy to follow |
| Marketing / promo | `af_sky`/`am_michael` | Energetic or authoritative |
| Documentation | `bf_emma`/`bm_george` | Clear British English, formal |
| Casual / social | `af_heart`/`af_sky` | Approachable, natural |

### Multilingual

Voice IDs encode language in the first letter: `a`=American English, `b`=British English, `e`=Spanish, `f`=French, `h`=Hindi, `i`=Italian, `j`=Japanese, `p`=Brazilian Portuguese, `z`=Mandarin. Auto-detects phonemizer locale from prefix — no `--lang` needed when voice matches text.

```bash
npx hyperframes tts "La reunión empieza a las nueve" --voice ef_dora --output es.wav
npx hyperframes tts "今日はいい天気ですね" --voice jf_alpha --output ja.wav
```

Non-English phonemization requires `espeak-ng` (`brew install espeak-ng` / `apt-get install espeak-ng`).

### Speed

- `0.7-0.8` — tutorial, complex content, accessibility
- `1.0` — natural pace (default)
- `1.1-1.2` — intros, transitions, upbeat content
- `1.5+` — rarely appropriate; test carefully

### Requirements

Python 3.8+ with `kokoro-onnx` and `soundfile` (`pip install kokoro-onnx soundfile`). Model ~311 MB + ~27 MB voices.

## Transcription (`transcribe`)

Produce a normalized `transcript.json` with word-level timestamps.

```bash
npx hyperframes transcribe audio.mp3
npx hyperframes transcribe video.mp4 --model small --language es
npx hyperframes transcribe subtitles.srt          # import existing
npx hyperframes transcribe subtitles.vtt
npx hyperframes transcribe openai-response.json
```

### Language Rule (Non-Negotiable)

**Never use `.en` models unless the user explicitly states the audio is English.** `.en` models (`small.en`, `medium.en`) **translate** non-English audio into English instead of transcribing it. This silently destroys the original language.

1. Language known and non-English → `--model small --language <code>` (no `.en` suffix)
2. Language known and English → `--model small.en`
3. Language unknown → `--model small` (no `.en`, no `--language`) — whisper auto-detects

**Default model is `small`, not `small.en`.**

### Model Sizes

| Model | Size | Speed | When to use |
|---|---|---|---|
| `tiny` | 75 MB | Fastest | Quick previews, testing pipeline |
| `base` | 142 MB | Fast | Short clips, clear audio |
| `small` | 466 MB | Moderate | **Default** — most content |
| `medium` | 1.5 GB | Slow | Important content, noisy audio, music |
| `large-v3` | 3.1 GB | Slowest | Production quality |

Music with vocals: start at `medium` minimum.

### Output Shape

```json
[
  { "id": "w0", "text": "Hello", "start": 0.0, "end": 0.5 },
  { "id": "w1", "text": "world.", "start": 0.6, "end": 1.2 }
]
```

## Background Removal (`remove-background`)

Remove the background from a video or image for transparent overlay use.

```bash
npx hyperframes remove-background subject.mp4 -o transparent.webm  # default: VP9 alpha WebM
npx hyperframes remove-background subject.mp4 -o transparent.mov   # ProRes 4444 (editing)
npx hyperframes remove-background portrait.jpg -o cutout.png       # single-image cutout
npx hyperframes remove-background subject.mp4 -o subject.webm \
  --background-output plate.webm                                   # both layers in one pass
npx hyperframes remove-background --info                           # detected providers
```

Uses `u2net_human_seg` (MIT). First run downloads ~168 MB.

### Layer Separation (`--background-output`)

| File | Alpha is… | Use it for |
|---|---|---|
| `-o subject.webm` | Mask — subject opaque, background transparent | Foreground layer, place on top |
| `--background-output plate.webm` | Inverse — surroundings opaque, subject region transparent | Bottom layer; put text/graphics between this and the subject |

**Hole-cut plate, not inpainted.** The subject region in `plate.webm` is fully transparent.

| Use case | Right tool |
|---|---|
| Text/graphics between cutout and plate | **Hole-cut** (`--background-output`) |
| Subject onto an unrelated scene | Just `subject.webm` |
| Show room without person standalone | **Clean plate** — needs inpainter (LaMa, ProPainter). Not this command. |

### Output Format

| Format | When |
|---|---|
| `.webm` (VP9 + alpha) | Default. Compositions play this directly. |
| `.mov` (ProRes 4444) | Editing in DaVinci/Premiere/FCP. Large files. |
| `.png` | Single-image cutout. |

### Quality Presets

| Preset | CRF | When |
|---|---|---|
| `fast` | 30 | Iterating, smaller file |
| `balanced` | 18 | Default. Visually identical for most uses |
| `best` | 12 | Master / final delivery |

## TTS → Transcribe → Captions Chain

When there's no pre-recorded voiceover, generate one and transcribe it back:

```bash
npx hyperframes tts script.txt --voice af_heart --output narration.wav
npx hyperframes transcribe narration.wav   # → transcript.json
```

Whisper extracts precise word boundaries from the generated audio, so caption timing matches delivery without hand-tuning.
