---
name: dispatching-parallel-agents
description: Use when multiple independent failures or tasks exist across different domains — dispatches one focused agent per problem to investigate and fix concurrently instead of sequentially
---

# Dispatching Parallel Agents

## Overview

Delegate tasks to specialized agents with isolated context. When multiple unrelated failures exist across different subsystems, investigating them sequentially wastes time. Each investigation is independent and can happen in parallel.

**Core principle:** Dispatch one agent per independent problem domain. Let them work concurrently.

## When to Use

```
Multiple failures?
  → Are they independent?
      → No (related): Single agent investigates all
      → Yes: Can they work in parallel?
            → Yes: Parallel dispatch
            → No (shared state): Sequential agents
```

**Use when:**
- 3+ test files failing with different root causes
- Multiple subsystems broken independently
- Each problem can be understood without context from others
- No shared state between investigations

**Don't use when:**
- Failures are related (fix one might fix others)
- Need to understand full system state first
- Agents would interfere with each other (editing same files)

## The Pattern

### 1. Identify Independent Domains

Group failures by what's broken:
- File A tests: Tool approval flow
- File B tests: Batch completion behavior
- File C tests: Abort functionality

Each domain is independent.

### 2. Create Focused Agent Tasks

Each agent gets:
- **Specific scope:** One test file or subsystem
- **Clear goal:** Make these tests pass
- **Constraints:** Don't change other code
- **Expected output:** Summary of what you found and fixed

### 3. Dispatch in Parallel

```typescript
Task("Fix agent-tool-abort.test.ts failures")
Task("Fix batch-completion-behavior.test.ts failures")
Task("Fix tool-approval-race-conditions.test.ts failures")
// All three run concurrently
```

### 4. Review and Integrate

When agents return:
- Read each summary
- Verify fixes don't conflict
- Run full test suite
- Integrate all changes

## Agent Prompt Structure

Good agent prompts are focused, self-contained, and specific about output:

```markdown
Fix the 3 failing tests in src/agents/agent-tool-abort.test.ts:

1. "should abort tool with partial output capture" - expects 'interrupted at' in message
2. "should handle mixed completed and aborted tools" - fast tool aborted instead of completed
3. "should properly track pendingToolCount" - expects 3 results but gets 0

These are timing/race condition issues. Your task:

1. Read the test file and understand what each test verifies
2. Identify root cause - timing issues or actual bugs?
3. Fix by replacing arbitrary timeouts with event-based waiting
4. Do NOT just increase timeouts - find the real issue.

Return: Summary of what you found and what you fixed.
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| Too broad scope | "Fix all the tests" → agent gets lost. Be specific. |
| No context | Paste error messages and test names |
| No constraints | Add "Do NOT change production code" or similar |
| Vague output | "Fix it" → "Return summary of root cause and changes" |

## Verification After Agents Return

1. Review each summary — understand what changed
2. Check for conflicts — did agents edit same files?
3. Run full test suite — verify all fixes work together
4. Spot check — agents can make systematic errors

## Key Benefits

- **Parallelization** — multiple investigations happen simultaneously
- **Focus** — each agent has narrow scope, less context to track
- **Independence** — agents don't interfere
- **Speed** — 3 problems solved in time of 1
