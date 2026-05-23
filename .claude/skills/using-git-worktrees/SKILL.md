---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - ensures an isolated workspace exists via native tools or git worktree fallback
---

# Using Git Worktrees

## Overview

Ensure work happens in an isolated workspace. Prefer native worktree tools. Fall back to manual git worktrees only when no native tool is available.

**Core principle:** Detect existing isolation first. Then use native tools. Then fall back to git. Never fight the harness.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Step 0: Detect Existing Isolation

**Before creating anything, check if already in an isolated workspace:**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```

**Submodule guard:** `GIT_DIR != GIT_COMMON` is also true inside submodules. Verify:
```bash
git rev-parse --show-superproject-working-tree 2>/dev/null
# If this returns a path, you're in a submodule — treat as normal repo
```

**If `GIT_DIR != GIT_COMMON` (and not a submodule):** Already in a linked worktree. Skip to Step 3. Do NOT create another worktree.

**If `GIT_DIR == GIT_COMMON`:** Normal repo checkout. Ask for consent before creating worktree:
> "Would you like me to set up an isolated worktree? It protects your current branch from changes."

## Step 1: Create Isolated Workspace

### 1a. Native Worktree Tools (preferred)

If you have a tool like `EnterWorktree`, `WorktreeCreate`, `/worktree` command, or `--worktree` flag — **use it**. Skip to Step 3.

Using `git worktree add` when you have a native tool is the #1 mistake — creates phantom state the harness can't manage.

### 1b. Git Worktree Fallback

**Only use if Step 1a does not apply.**

**Directory selection priority:**
1. User's declared preference in instructions
2. Existing `.worktrees/` directory (verify gitignored)
3. Existing `worktrees/` directory (verify gitignored)
4. Existing `~/.config/superpowers/worktrees/$project/` (legacy global)
5. Default: create `.worktrees/` at project root

**Safety verification (project-local only):**
```bash
git check-ignore -q .worktrees 2>/dev/null
```
If NOT ignored: add to `.gitignore`, commit, then proceed.

**Create the worktree:**
```bash
project=$(basename "$(git rev-parse --show-toplevel)")
git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

**Sandbox fallback:** If `git worktree add` fails with permission error — tell user, work in place, skip to Step 3.

## Step 3: Project Setup

```bash
if [ -f package.json ]; then npm install; fi
if [ -f Cargo.toml ]; then cargo build; fi
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi
if [ -f go.mod ]; then go mod download; fi
```

## Step 4: Verify Clean Baseline

```bash
npm test / cargo test / pytest / go test ./...
```

If tests fail: report failures, ask whether to proceed or investigate.

If tests pass:
```
Worktree ready at <full-path>
Tests passing (<N> tests, 0 failures)
Ready to implement <feature-name>
```

## Quick Reference

| Situation | Action |
|---|---|
| Already in linked worktree | Skip creation (Step 0) |
| In a submodule | Treat as normal repo |
| Native worktree tool available | Use it (Step 1a) |
| No native tool | Git worktree fallback (Step 1b) |
| `.worktrees/` exists | Use it (verify ignored) |
| Both `.worktrees/` and `worktrees/` exist | Use `.worktrees/` |
| Neither exists | Default `.worktrees/` |
| Directory not ignored | Add to .gitignore + commit |
| Permission error on create | Work in place |
| Tests fail during baseline | Report failures + ask |

## Common Mistakes

| Mistake | Fix |
|---|---|
| Using `git worktree add` when native tool exists | Always check Step 1a first — #1 mistake |
| Skipping detection | Always run Step 0 |
| Skipping ignore verification | Always `git check-ignore` before project-local worktree |
| Proceeding with failing tests | Report failures, get explicit permission |

## Red Flags

**Never:**
- Create a worktree when Step 0 detects existing isolation
- Use `git worktree add` when a native worktree tool exists
- Skip Step 1a and jump to git commands
- Create worktree without verifying it's ignored (project-local)
- Proceed with failing tests without asking
