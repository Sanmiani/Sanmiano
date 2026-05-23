---
name: writing-skills
description: Use when creating a new reusable skill document — applies TDD to process documentation with RED (baseline test) GREEN (write skill) REFACTOR (close loopholes) cycle
---

# Writing Skills

## Overview

**Writing skills IS Test-Driven Development applied to process documentation.**

Personal skills live in `~/.claude/skills` for Claude Code.

**Core principle:** If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing.

**Iron Law:** NO SKILL WITHOUT A FAILING TEST FIRST. Applies to new skills AND edits.

## TDD Mapping for Skills

| TDD Concept | Skill Creation |
|---|---|
| Test case | Pressure scenario with subagent |
| Production code | Skill document (SKILL.md) |
| Test fails (RED) | Agent violates rule without skill |
| Test passes (GREEN) | Agent complies with skill present |
| Refactor | Close loopholes while maintaining compliance |

## SKILL.md Structure

**Required frontmatter:**
```yaml
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions and symptoms]
---
```

- `name`: letters, numbers, hyphens only. No special characters.
- `description`: Start with "Use when..." — triggering conditions ONLY. Never summarize the skill's workflow.
- Max 1024 characters total in frontmatter.

**Why description = conditions only (never workflow):**
When a description summarizes workflow, Claude may follow the description instead of reading the full skill. A description saying "code review between tasks" caused Claude to do ONE review even though the skill's flowchart showed TWO. Conditions-only descriptions prevent this shortcut.

**Content template:**
```markdown
# Skill Name

## Overview
Core principle in 1-2 sentences.

## When to Use
Bullet list with symptoms and use cases.
When NOT to use.

## Core Pattern
Before/after comparison or step-by-step.

## Quick Reference
Table or bullets for scanning.

## Common Mistakes
What goes wrong + fixes.
```

## RED-GREEN-REFACTOR for Skills

### RED: Baseline Without Skill
Run pressure scenario with subagent WITHOUT the skill. Document:
- Exact choices made
- Rationalizations used (verbatim)
- Which pressures triggered violations

### GREEN: Write Minimal Skill
Address those specific rationalizations. Don't add content for hypothetical cases.
Run same scenarios WITH skill — agent should comply.

### REFACTOR: Close Loopholes
Agent found new rationalization? Add explicit counter. Re-test until bulletproof.

## When to Create a Skill

**Create when:**
- Technique wasn't intuitively obvious
- You'd reference it again across projects
- Pattern applies broadly

**Don't create for:**
- One-off solutions
- Project-specific conventions (put in CLAUDE.md)
- Standard practices well-documented elsewhere

## Directory Structure

```
skills/
  skill-name/
    SKILL.md              # Main reference (required)
    supporting-file.*     # Only if needed
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| Description summarizes workflow | Description = conditions only, "Use when..." |
| Skipping baseline test | No skill without watching it fail first |
| Creating multiple skills without testing each | Test and deploy each before moving on |
| Narrative examples | Use concrete patterns, not session stories |

## The Iron Law

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

Write skill before testing? Delete it. Start over.
Edit skill without testing? Same violation.
No exceptions — not for "simple additions", not for "documentation updates".
