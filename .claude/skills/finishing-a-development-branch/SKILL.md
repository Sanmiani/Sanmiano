---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup
---

# Finishing a Development Branch

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Detect environment → Present options → Execute choice → Clean up.

**Announce at start:** "I'm using the finishing-a-development-branch skill to complete this work."

## The Process

### Step 1: Verify Tests

```bash
npm test / cargo test / pytest / go test ./...
```

**If tests fail:** Show failures. Stop. Don't proceed to Step 2.

**If tests pass:** Continue.

### Step 2: Detect Environment

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```

| State | Menu | Cleanup |
|---|---|---|
| `GIT_DIR == GIT_COMMON` (normal repo) | 4 options | No worktree to clean |
| `GIT_DIR != GIT_COMMON`, named branch | 4 options | Provenance-based |
| `GIT_DIR != GIT_COMMON`, detached HEAD | 3 options (no merge) | None |

### Step 3: Determine Base Branch

```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

### Step 4: Present Options

**Normal repo / named-branch worktree — exactly 4 options:**

```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option?
```

**Detached HEAD — exactly 3 options:**

```
Implementation complete. You're on a detached HEAD (externally managed workspace).

1. Push as new branch and create a Pull Request
2. Keep as-is (I'll handle it later)
3. Discard this work
```

### Step 5: Execute Choice

**Option 1: Merge Locally**
```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git checkout <base-branch> && git pull && git merge <feature-branch>
# Run tests, then cleanup worktree (Step 6), then delete branch
git branch -d <feature-branch>
```

**Option 2: Push and Create PR**
```bash
git push -u origin <feature-branch>
gh pr create --title "<title>" --body "..."
```
**Do NOT clean up worktree** — user needs it for PR iteration.

**Option 3: Keep As-Is**
Report branch name and worktree path. Don't cleanup.

**Option 4: Discard**
Require typed `discard` confirmation. Then cleanup (Step 6), then force-delete:
```bash
git branch -D <feature-branch>
```

### Step 6: Cleanup Workspace (Options 1 and 4 only)

```bash
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```

- `GIT_DIR == GIT_COMMON`: Normal repo, nothing to clean.
- Worktree under `.worktrees/`, `worktrees/`, or `~/.config/superpowers/worktrees/`: Superpowers owns it — clean up.

```bash
cd "$MAIN_ROOT"
git worktree remove "$WORKTREE_PATH"
git worktree prune
```

- **Otherwise:** Host harness owns the workspace. Do NOT remove it.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch |
|---|---|---|---|---|
| 1. Merge locally | yes | — | — | yes |
| 2. Create PR | — | yes | yes | — |
| 3. Keep as-is | — | — | yes | — |
| 4. Discard | — | — | — | yes (force) |

## Common Mistakes

| Mistake | Fix |
|---|---|
| Skipping test verification | Always verify before offering options |
| Cleaning up worktree for Option 2 | Only cleanup for Options 1 and 4 |
| Deleting branch before removing worktree | Remove worktree first, then branch |
| Running `git worktree remove` from inside worktree | Always `cd` to main repo root first |
| No confirmation for discard | Require typed "discard" |

## Red Flags

**Never:**
- Proceed with failing tests
- Remove a worktree you didn't create
- Force-push without explicit request
- Run `git worktree remove` from inside the worktree

**Always:**
- Verify tests before offering options
- Present exactly 4 options (or 3 for detached HEAD)
- Get typed confirmation for Option 4
- Run `git worktree prune` after removal
