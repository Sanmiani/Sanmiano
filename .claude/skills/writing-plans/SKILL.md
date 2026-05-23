---
name: writing-plans
description: Use when a spec or design has been approved and needs to be turned into a detailed, executable implementation plan with bite-sized tasks
---

# Writing Plans

## Overview

Create comprehensive implementation plans that can be executed by subagents with zero codebase context.

**Announce at start:** "I'm using the writing-plans skill to create an implementation plan."

## Planning Approach

- Map file structure first, then decompose into tasks
- Each task takes 2-5 minutes and follows TDD: test → verify fail → implement → verify pass → commit
- No placeholders ("TBD", vague instructions like "add validation")
- Every code step includes complete, working code
- Exact file paths and commands with expected output

## Plan Structure

```markdown
# Plan: <Feature Name>
Date: YYYY-MM-DD

## Goal
<One sentence>

## Architecture
<How this fits into the existing system>

## Tech Stack
<What's being used>

## File Inventory
<Every file that will be created or modified>

## Tasks

### Task 1: <Name>
**Files:** src/foo.ts, src/foo.test.ts
**Steps:**
1. Write test: [exact test code]
2. Run test — verify it FAILS
3. Implement: [exact implementation code]
4. Run test — verify it PASSES
5. Commit: "feat: add foo"
```

## Content Requirements

- **No placeholders** — every step has complete, runnable code
- **TDD mandatory** — every task: write test first, verify it fails, then implement
- **Exact commands** — include expected output for verification steps
- **DRY, YAGNI** — don't plan features that aren't in the spec
- **Frequent commits** — each task ends with a commit

## Where to Save

```
docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md
```

## Self-Review Before Handoff

Before handing plan to executing-plans or subagent-driven-development:
- No "TBD" or vague steps
- All code blocks complete and runnable
- File paths exact
- Test steps include "verify it fails" before "verify it passes"
- Every task ends with a commit command

## Execution Options

After saving the plan, offer:
1. **`superpowers:subagent-driven-development`** — parallel subagents, two-stage review (recommended)
2. **`superpowers:executing-plans`** — solo execution with checkpoints

## Common Mistakes

| Mistake | Fix |
|---|---|
| Vague steps ("add validation") | Write exact code for every step |
| Skipping TDD steps | Every task: test → fail → implement → pass |
| Planning outside the spec | YAGNI — only what's in the spec |
| Multi-subsystem plan | Split into independent plans first |
