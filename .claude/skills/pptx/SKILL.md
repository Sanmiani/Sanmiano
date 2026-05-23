---
name: pptx
description: Use this skill for all PowerPoint (.pptx) work — creating presentations from scratch, editing existing ones, reading content, and applying professional design. Every slide needs a visual element.
license: MIT
---

# PPTX Skill

Handles all PowerPoint presentation work: creation, editing, reading, and modification of .pptx files.

## Key Commands

```bash
# Text extraction
python -m markitdown presentation.pptx

# Visual preview
python scripts/thumbnail.py presentation.pptx

# Raw XML access
python scripts/office/unpack.py presentation.pptx unpacked/
```

## Core Workflows

- **Editing existing presentations**: Unpack → edit content → clean → repack (see editing.md)
- **Creating from scratch**: PptxGenJS when no template exists (see pptxgenjs.md)

## Design Principles

**Never use plain text slides.** Every slide needs a visual element — image, chart, icon, or shape.

### Color Strategy

Pick topic-specific palettes with:
- One dominant color (60-70%)
- Supporting tones
- Sharp accent color

Ten reference palettes: Midnight Executive, Ocean Breeze, Earthy Warmth, Cherry Bold, Tech Blue, Sunset Warm, Forest Green, Slate Professional, Coral Energy, Golden Classic.

### Typography

Pair interesting header fonts with clean body fonts:
- Title text: 36-44pt bold
- Body text: 14-16pt

### Layout Variety

Use diverse layouts — avoid repeating the same pattern:
- Two-column layouts
- Icon + text rows
- Grid arrangements
- Half-bleed images
- Minimum 0.5" margins
- 0.3-0.5" spacing between blocks

## Critical Mistakes to Avoid

- Never repeat layouts across slides
- Never center body text
- Never default to blue without justification
- Never use "accent lines under titles" — hallmark of AI-generated slides

## Quality Assurance

```bash
# Verify content (check for "xxxx", "lorem", placeholder text)
python -m markitdown output.pptx

# Visual inspection
python scripts/thumbnail.py output.pptx
```

Check for: overlaps, text overflow, contrast issues, alignment problems.

## Dependencies

markitdown, Pillow, pptxgenjs, LibreOffice, Poppler
