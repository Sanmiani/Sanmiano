---
name: slack-gif-creator
description: Use this skill to create animated GIFs optimized for Slack — emoji-size (128x128) or message-size (480x480), under 3 seconds, using PIL/Pillow with easing and animation patterns.
license: MIT
---

# Slack GIF Creator Skill

This skill helps create animated GIFs optimized for Slack integration.

## Slack Requirements

| Type | Size | Frame Rate | Max Duration |
|------|------|-----------|--------------|
| Emoji GIFs | 128x128 (recommended) | 10-30 FPS | 3 seconds |
| Message GIFs | 480x480 | 10-30 FPS | 3 seconds |

## Dependencies

```bash
pip install Pillow imageio numpy
```

## Core Animation Patterns

### Shake/Vibrate
```python
import math
def shake(frame, total_frames, amplitude=5):
    t = frame / total_frames
    return int(amplitude * math.sin(t * 2 * math.pi * 10))
```

### Pulse Scale
```python
def pulse_scale(frame, total_frames, min_scale=0.8, max_scale=1.2):
    t = frame / total_frames
    scale = min_scale + (max_scale - min_scale) * (0.5 + 0.5 * math.sin(t * 2 * math.pi))
    return scale
```

### Bounce
```python
def bounce_ease_out(t):
    if t < 1/2.75:
        return 7.5625 * t * t
    elif t < 2/2.75:
        t -= 1.5/2.75
        return 7.5625 * t * t + 0.75
    else:
        t -= 2.625/2.75
        return 7.5625 * t * t + 0.984375
```

### Fade
```python
def fade_alpha(frame, total_frames, fade_in=True):
    t = frame / total_frames
    return int(255 * t) if fade_in else int(255 * (1 - t))
```

## Building a GIF

```python
from PIL import Image, ImageDraw
import imageio

frames = []
size = (128, 128)  # Emoji size
fps = 20
duration = 2.0  # seconds
total_frames = int(fps * duration)

for i in range(total_frames):
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Your animation logic here
    progress = i / total_frames
    radius = int(20 + 30 * math.sin(progress * math.pi * 2))
    center = (64, 64)
    draw.ellipse([
        center[0] - radius, center[1] - radius,
        center[0] + radius, center[1] + radius
    ], fill=(255, 100, 50, 255))
    
    frames.append(img)

# Save
imageio.mimsave('output.gif', [f.convert('RGB') for f in frames], fps=fps)
```

## Design Philosophy

Use PIL primitives for creative flexibility — not rigid templates. Combine easing functions, color theory, and composition for polished results.

**Graphics quality tips:**
- Thicker lines (width 2+)
- Layer shapes for depth
- Vibrant colors that read at small sizes
- Detailed composition even at 128px
- Avoid "basic" placeholder-quality output
