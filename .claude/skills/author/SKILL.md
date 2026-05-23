---
name: author
description: Use this skill when the user wants to write, plan, or publish a book of any genre — fiction (thriller, romance, sci-fi, fantasy, mystery, horror, historical, literary), non-fiction (self-help, memoir, business, biography, history, psychology), technical (handbooks, whitepapers, guides, manuals), or children's/YA. Triggers on: "write a book", "help me write my book", "design a book cover", "create a table of contents", "Amazon KDP package", "Kindle publishing", "book blurb", or any request to author, outline, or publish a book.
---

# Book Forge — AI Book Authoring Studio

A structured five-stage workspace that takes a user from raw concept to a publish-ready Amazon Kindle package.

**Genres covered:**
- Fiction: thriller, romance, sci-fi, fantasy, mystery, literary, horror, historical
- Non-fiction: self-help, memoir, business, biography, history, psychology
- Technical/professional: handbooks, whitepapers, guides, reference manuals, tutorial series
- Children's and young adult

---

## Implementation

When this skill is triggered, build and present the Book Forge React artifact located in `assets/book-forge.jsx`. Present it using `create_file` to write the artifact to `/mnt/user-data/outputs/book-forge.jsx`, then call `present_files`.

The artifact calls the Anthropic API directly at `https://api.anthropic.com/v1/messages` using `claude-sonnet-4-20250514`. No API key is required — handled by the environment.

Give a brief one-sentence introduction only. The artifact is self-guiding.

---

## Five-Stage Pipeline

### Stage 1 — Idea Lab
- Genre selection, subgenre, target audience, concept input
- AI generates title candidates with commercial hooks
- Returns JSON array: `[{ title, subtitle, hook }]`

### Stage 2 — Structure
- AI-architected table of contents with 12–16 chapters
- Optional part groupings, per-chapter briefs
- Returns JSON array: `[{ part (nullable), chapter (int), title, description }]`

### Stage 3 — Draft
- Chapter-by-chapter AI prose generation
- 700–900 word opening passages per chapter
- Draft status tracking across all chapters
- "Continue chapter" extends any draft using the chapter title, brief, and prior draft as context

### Stage 4 — Cover
- AI-generated book cover palette, mood, tagline, and layout pattern
- Rendered as a full SVG preview
- Returns JSON: `{ bg, accent, titleColor, mood, tagline, pattern }`
- Pattern is one of: `geometric`, `organic`, `minimal`, `dramatic`

### Stage 5 — Kindle Launch
- Full Amazon KDP package:
  - 150-word blurb
  - 45-word search hook (shortBlurb)
  - Seven KDP keywords (array)
  - Primary BISAC category
  - Secondary BISAC category
  - Author bio template
  - Three editorial review pull-quote hooks (array)
- Returns JSON: `{ blurb, shortBlurb, keywords, primaryCategory, secondaryCategory, authorBio, reviewHooks }`

---

## Design Principles

- All AI calls return structured JSON driving UI state
- Always prompt the model to return **raw JSON with no markdown fences**
- The React artifact is the primary deliverable — no additional prose explanation needed

---

## Edge Cases

| Situation | Response |
|---|---|
| User already has a title or concept | Pre-populate the Idea Lab and direct them to the most relevant stage |
| User only wants one stage (e.g. "just design a cover") | Open the artifact and navigate directly to that stage |
| User wants to extend chapter drafts beyond the opening passage | Add a "Continue chapter" call using chapter title + brief + prior draft as context |
