---
name: brainstorming
description: Use when starting any new feature, project, or task — enforces design-before-code with a hard gate: no implementation until a spec is written and approved
---

# Brainstorming

## Overview

Collaborative design process for turning ideas into specifications before implementation begins.

**Core principle:** No code, scaffolding, or implementation until a design is presented and approved. "Simple" projects often waste the most effort through unexamined assumptions.

**Announce at start:** "I'm using the brainstorming skill to design this before we build."

## The Nine-Step Process

1. **Explore** project context — read files, docs, recent commits
2. **Offer visual companion** — only if complexity warrants it, as a standalone message
3. **Ask clarifying questions** — one per message, use multiple-choice when possible
4. **Propose 2-3 approaches** with trade-offs for each
5. **Present design sections sequentially** — don't dump everything at once
6. **Write design doc** to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
7. **Self-review** — scan for placeholders, contradictions, and ambiguity
8. **Request user review** of the written spec
9. **Invoke writing-plans** to create implementation details

## Key Guidelines

- **Hard gate:** Never invoke implementation skills until brainstorming is complete and spec approved
- **Isolation:** Break systems into focused units with clear purposes and well-defined interfaces
- **Scope flag:** Multi-subsystem requests get flagged immediately — decompose into independent pieces
- **YAGNI:** Ruthlessly remove unnecessary features before they make it into the spec
- **Questions:** One per message. Multiple-choice format preferred.

## When to Use

- Starting any new feature, even "simple" ones
- Before running executing-plans or subagent-driven-development
- When requirements are ambiguous or unstated

## When NOT to Use

- Executing a plan that already exists — use executing-plans instead
- Trivial single-file changes with no design decisions

## Terminal State

Only invoke `superpowers:writing-plans` after brainstorming completes. Never invoke implementation skills (executing-plans, subagent-driven-development) directly from here.

## Common Mistakes

**Skipping for "simple" tasks** — simple tasks have the most unexamined assumptions
**Asking multiple questions at once** — one question per message, always
**Writing code during brainstorming** — hard gate applies even to "just a quick example"
