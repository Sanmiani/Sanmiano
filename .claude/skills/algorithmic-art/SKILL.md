---
name: algorithmic-art
description: Use this skill to create computational generative art using p5.js with seeded randomness, parameter controls, and interactive exploration.
license: MIT
---

# Algorithmic Art Generation Skill

This skill enables creation of computational aesthetic works using p5.js with seeded randomness and interactive parameter exploration.

## Core Process

Two distinct phases:

1. **Algorithmic Philosophy Creation** — Develop a manifesto describing the generative aesthetic through computational concepts (noise fields, particle behavior, emergent systems, mathematical relationships)

2. **p5.js Implementation** — Express the philosophy as interactive generative art with parameter controls and seed-based reproducibility

## Key Principles

**Philosophy Development**:
- "Name the movement" with 1-2 word titles reflecting the computational aesthetic
- Articulate 4-6 paragraph philosophies emphasizing "meticulously crafted algorithm" and "master-level implementation"
- Beauty emerges from algorithmic *process*, not static output

**Technical Requirements**:
- Always implement seeded randomness following "Art Blocks Pattern" for reproducibility
- Design parameters emerging naturally from system properties (quantities, scales, probabilities, thresholds)
- Build algorithms that express philosophy directly
- Start from `templates/viewer.html` as foundation
- Keep fixed sections unchanged: layout, branding (Poppins/Lora fonts), sidebar structure
- Replace only variable sections: p5.js algorithm, parameter definitions, UI controls
- Deliver single self-contained HTML artifacts with inline everything (no external files except p5.js CDN)

## Artifact Structure

Required sidebar sections:
- **Seed**: Display with prev/next/random/jump controls
- **Parameters**: Sliders/inputs matching algorithmic needs
- **Colors**: Optional color pickers (include only if art requires adjustable palettes)
- **Actions**: Regenerate, Reset, Download PNG buttons

## Conceptual Depth

Embed "subtle, niche references" into algorithmic parameters and behaviors — sophisticated enough that domain experts intuit meaning while others experience compelling generative composition.
