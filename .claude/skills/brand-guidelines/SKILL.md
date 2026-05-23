---
name: brand-guidelines
description: Use this skill to apply Anthropic's official brand identity resources for visual formatting and design standardization across artifacts, slides, and documents.
license: MIT
---

# Anthropic Brand Styling Skill

This skill provides access to Anthropic's official brand identity resources for visual formatting and design standardization.

## Color Palette

- **Dark**: `#141413`
- **Light**: `#faf9f5`
- **Orange** (primary accent): `#d97757`
- **Blue** (complementary): available in palette
- **Green** (complementary): available in palette

## Typography Standards

- **Headings**: Poppins (with Arial fallback)
- **Body text**: Lora (with Georgia fallback)

**Smart Application:**
- Headings at 24pt+ → Poppins
- Body text → Lora
- Accent colors cycle through orange, blue, and green for non-text visual elements

## Technical Implementation

Uses python-pptx's RGBColor class for precise color application. Includes fallback mechanisms ensuring functionality across different systems without requiring custom font installation.

## Usage

Apply these brand standards whenever creating:
- Presentation slides
- Documents
- HTML artifacts
- Reports
- Any visual material requiring Anthropic brand consistency
