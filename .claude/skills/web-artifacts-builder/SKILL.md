---
name: web-artifacts-builder
description: Use this skill to create elaborate, multi-component claude.ai HTML artifacts using React 18, Tailwind CSS, and shadcn/ui. For complex artifacts requiring state management, routing, or component libraries — not simple single-file HTML.
license: MIT
---

# Web Artifacts Builder

Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies.

**Stack**: React 18 + TypeScript + Vite + Parcel (bundling) + Tailwind CSS + shadcn/ui

## Quick Start

### Step 1: Initialize Project

```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

Creates a fully configured project with:
- React + TypeScript (via Vite)
- Tailwind CSS 3.4.1 with shadcn/ui theming
- Path aliases (`@/`) configured
- 40+ shadcn/ui components pre-installed
- All Radix UI dependencies included
- Parcel configured for bundling

### Step 2: Develop Your Artifact

Edit the generated files. See Common Development Tasks for guidance.

### Step 3: Bundle to Single HTML File

```bash
bash scripts/bundle-artifact.sh
```

Creates `bundle.html` — a self-contained artifact with all JavaScript, CSS, and dependencies inlined. Share directly in Claude conversations.

**Requirements**: Project must have an `index.html` in the root directory.

### Step 4: Share with User

Share the bundled HTML file so the user can view it as an artifact.

### Step 5: Testing (Optional)

Only perform if necessary or requested. Test after presenting the artifact — avoid upfront testing that adds latency.

## Design & Style Guidelines

**CRITICAL**: Avoid "AI slop":
- No excessive centered layouts
- No purple gradients
- No uniform rounded corners everywhere
- No Inter font as default

Instead: distinctive typography, intentional color choices, layouts with character.

## Reference

- shadcn/ui components: https://ui.shadcn.com/docs/components
