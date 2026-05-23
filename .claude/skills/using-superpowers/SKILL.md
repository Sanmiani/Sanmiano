---
name: using-superpowers
description: Use when first starting a session, when asked what skills are available, or when unsure which superpowers skill applies to the current task
---

# Using Superpowers

## Overview

Superpowers is an agentic skills framework and software development methodology. It provides composable skills that guide agents through deliberate, structured workflows — from understanding requirements through delivery.

**Core principle:** Understand before building. Design before coding. Verify before claiming done.

## The Standard Workflow

```
New task arrives
      ↓
brainstorming       ← Design first. Hard gate: no code until spec approved.
      ↓
writing-plans       ← Detailed implementation plan with bite-sized tasks.
      ↓
subagent-driven-development  ← Execute plan with isolated agents + two-stage review.
  OR executing-plans          ← Execute plan solo with checkpoints.
      ↓
finishing-a-development-branch  ← Verify, choose merge/PR/keep/discard.
```

## Skill Directory

| Skill | When to Use |
|---|---|
| `brainstorming` | Starting any new feature — design before code |
| `writing-plans` | After spec approved — create implementation plan |
| `executing-plans` | Have a plan, execute it with checkpoints |
| `subagent-driven-development` | Execute plan with parallel subagents + reviews |
| `dispatching-parallel-agents` | Multiple independent failures to fix concurrently |
| `finishing-a-development-branch` | Implementation done — merge, PR, or discard |
| `requesting-code-review` | After each task — dispatch reviewer subagent |
| `receiving-code-review` | Got review feedback — verify before implementing |
| `systematic-debugging` | Bug or failure — root cause before any fix |
| `test-driven-development` | Any feature or fix — test first always |
| `using-git-worktrees` | Starting feature work — set up isolated workspace |
| `verification-before-completion` | Before claiming anything done — run and show proof |
| `writing-skills` | Creating a new reusable skill document |

## Key Principles Across All Skills

1. **Design before code** — brainstorming hard gate
2. **Test before implementation** — TDD Iron Law
3. **Isolated workspaces** — git worktrees for feature work
4. **Root cause before fix** — systematic debugging
5. **Verify before claiming done** — verification-before-completion
6. **Review early, review often** — code review after each task
7. **Parallel when independent** — dispatch agents concurrently

## Supported Platforms

Claude Code, Codex CLI, Codex App, Gemini CLI, OpenCode, Cursor, GitHub Copilot CLI.

Skills work best on platforms with subagent support (Claude Code, Codex). On platforms without subagents, use `executing-plans` instead of `subagent-driven-development`.
