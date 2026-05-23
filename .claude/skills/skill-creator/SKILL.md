---
name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
---

# Skill Creator

This skill provides guidance for creating effective skills.

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing
specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific
domains or tasks—they transform Claude from a general-purpose agent into a specialized agent
equipped with procedural knowledge that no model can fully possess.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

### Anatomy of a Skill

Every skill consists of a required SKILL.md file and optional bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts, etc.)
```

### Progressive Disclosure Design Principle

Skills use a three-level loading system to manage context efficiently:

1. **Metadata (name + description)** - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed by Claude (Unlimited)

## Skill Creation Process

### Step 1: Understanding the Skill with Concrete Examples

Clearly understand concrete examples of how the skill will be used before writing anything. Ask:
- "What functionality should this skill support?"
- "Can you give examples of how this skill would be used?"
- "What would a user say that should trigger this skill?"

### Step 2: Planning the Reusable Skill Contents

For each concrete example, analyze:
1. How to execute the task from scratch
2. What scripts, references, and assets would help when executing repeatedly

**Script**: When the same code is rewritten repeatedly → `scripts/task.py`
**Reference**: When Claude needs domain docs to think through work → `references/schema.md`
**Asset**: When the skill needs files used in output → `assets/template.html`

### Step 3: Create the Skill

Create the directory and SKILL.md:

```
.claude/skills/skill-name/SKILL.md
```

SKILL.md frontmatter requirements:
- `name`: letters, numbers, hyphens only
- `description`: start with "Use when..." — triggering conditions only, never workflow summary
- Max 1024 characters in frontmatter total

### Step 4: Write the SKILL.md

**Writing style:** Imperative/infinitive form (verb-first). Not second-person. Example: "To accomplish X, do Y" rather than "You should do X."

Answer these questions:
1. What is the purpose of the skill in 1-2 sentences?
2. When should the skill be used?
3. How should Claude use the skill in practice?

**Content guidelines:**
- Write for another Claude instance — include non-obvious information
- Keep SKILL.md lean — move detailed reference material to `references/` files
- If files are large (>10k words), include grep search patterns in SKILL.md
- Avoid duplication: information lives in either SKILL.md or references, not both

### Step 5: Iterate

After testing the skill on real tasks:
1. Notice struggles or inefficiencies
2. Identify how SKILL.md or bundled resources should be updated
3. Implement changes and test again

## Common Mistakes

| Mistake | Fix |
|---|---|
| Description summarizes workflow | Description = triggering conditions only, "Use when..." |
| Writing in second person ("you should") | Use imperative form ("To do X, run Y") |
| Everything in SKILL.md | Move detailed docs to `references/`, schemas to `references/`, templates to `assets/` |
| Vague description | Be specific about what triggers the skill |
| No examples | Include 1-2 concrete examples of input → output |
