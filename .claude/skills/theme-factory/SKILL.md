---
name: theme-factory
description: Toolkit for styling artifacts with a professional theme. Apply one of 10 pre-set color/font themes to slides, docs, HTML pages, or any artifact. Or generate a custom theme on the fly.
license: MIT
---

# Theme Factory Skill

Provides a curated collection of professional font and color themes for styling artifacts — slides, docs, reports, HTML landing pages, and more.

## Usage

1. **Show the theme showcase**: Display `theme-showcase.pdf` so user can see all themes visually (do not modify it)
2. **Ask for their choice**: Which theme to apply?
3. **Wait for selection**: Get explicit confirmation
4. **Apply the theme**: Use the selected theme's colors and fonts throughout the artifact

## 10 Available Themes

| # | Theme | Character |
|---|-------|-----------|
| 1 | **Ocean Depths** | Professional and calming maritime |
| 2 | **Sunset Boulevard** | Warm and vibrant sunset colors |
| 3 | **Forest Canopy** | Natural and grounded earth tones |
| 4 | **Modern Minimalist** | Clean and contemporary grayscale |
| 5 | **Golden Hour** | Rich and warm autumnal palette |
| 6 | **Arctic Frost** | Cool and crisp winter-inspired |
| 7 | **Desert Rose** | Soft and sophisticated dusty tones |
| 8 | **Tech Innovation** | Bold and modern tech aesthetic |
| 9 | **Botanical Garden** | Fresh and organic garden colors |
| 10 | **Midnight Galaxy** | Dramatic and cosmic deep tones |

Each theme is defined in the `themes/` directory with:
- Cohesive color palette with hex codes
- Complementary font pairings for headers and body text
- Distinct visual identity

## Applying a Theme

After selection:
1. Read the corresponding file from `themes/`
2. Apply colors and fonts consistently throughout the artifact
3. Ensure proper contrast and readability
4. Maintain the theme's visual identity across all elements

## Creating a Custom Theme

When none of the 10 themes fit:
1. Ask the user for inputs (mood, brand colors, audience)
2. Generate a new theme with a descriptive name
3. Show it for review and confirmation
4. Apply as described above
