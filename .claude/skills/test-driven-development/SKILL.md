---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code — enforces write-failing-test-first with no exceptions
---

# Test-Driven Development

## Overview

TDD is mandatory for all feature implementation and bug fixes.

**Core mandate:** NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.

Writing code before tests? Delete it and start over. No keeping it as reference.

## The Cycle: Red-Green-Refactor

### RED — Write a Minimal Failing Test
- Write test demonstrating desired behavior
- Run it — **verify it fails for the right reason**
- If it passes immediately, the test is wrong

### GREEN — Implement Minimal Code
- Write only the simplest code necessary to pass
- Nothing extra. No anticipating future requirements.
- Run test — verify it passes

### REFACTOR — Clean Up
- Clean code while maintaining passing tests
- Run tests after every change

**Verification is mandatory at each phase. No skipping.**

## Why the Order Matters

"If you didn't watch the test fail, you don't know if it tests the right thing."

Tests written after implementation pass immediately — proving nothing. Tests-first discovers edge cases during design. Tests-after only verifies remembered scenarios.

## Common Rationalizations (All Invalid)

| Excuse | Reality |
|---|---|
| "I'll test after" | Tests passing immediately prove nothing about their validity |
| "Too simple to test" | Simple code breaks. Tests take 30 seconds. |
| "Already manually tested" | Manual tests aren't reproducible, don't run in CI |
| "Tests after achieve the same goals" | Tests-after = "what does this do?" Tests-first = "what SHOULD this do?" |
| "I'll keep the code as reference" | Delete it. Start over. No exceptions. |

## Red Flags — Stop and Start Over

- Code written before test
- "I already manually tested it"
- "Tests after achieve the same purpose"
- "It's about spirit not ritual"
- "This is different because..."

**All of these mean: Delete code. Start over with TDD.**

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

No exceptions:
- Not for "simple additions"
- Not for "just a quick fix"
- Not for proof-of-concept code
- Sunk cost doesn't apply — delete and restart

Write code before test? **Delete it. Start over.**
