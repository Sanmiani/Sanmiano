---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session — dispatches focused subagents per task with two-stage review (spec compliance then code quality)
---

# Subagent-Driven Development

## Overview

Execute implementation plans by dispatching specialized agents for each independent task. Each subagent operates with isolated, curated context — never inheriting your session history. Preserves your context for coordination.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration.

## When to Use

- You have a finalized implementation plan
- Tasks are mostly independent
- You need to remain in the current session

## The Cycle (per task)

```
1. Dispatch implementer subagent
     ↓ (answer questions if needed)
2. Implementer: implements + self-reviews
     ↓
3. Spec compliance review subagent
   (does it match requirements?)
     ↓ (if issues: implementer fixes, re-review)
4. Code quality review subagent
   (is the implementation sound?)
     ↓ (if issues: implementer fixes, re-review)
5. Mark task complete → next task
```

**Critical:** Spec compliance review ALWAYS before code quality review. Order matters.

## What Each Agent Gets

**Implementer:** Full task spec, required context, constraints, expected output format.

**Spec Compliance Reviewer:** The task requirements + the diff/code produced. Answers: does it match the spec?

**Code Quality Reviewer:** The code only. Answers: is it well-written, maintainable, and correct?

## Key Rules

- Don't pause between tasks — execute the entire plan continuously unless genuinely blocked
- Each agent gets curated context, never your full session history
- Two reviews per task — spec first, quality second
- If either reviewer finds issues: implementer fixes, both re-review

## Advantages

- TDD naturally followed by implementers with fresh context
- Two-stage review catches issues early
- Continuous execution eliminates handoff delays
- Your context stays clean for coordination

## Required Sub-Skills

- **`superpowers:brainstorming`** — design before this runs
- **`superpowers:writing-plans`** — plan before this runs
- **`superpowers:requesting-code-review`** — the review mechanism used in each cycle
- **`superpowers:finishing-a-development-branch`** — after all tasks complete
