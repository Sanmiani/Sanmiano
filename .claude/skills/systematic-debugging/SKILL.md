---
name: systematic-debugging
description: Use when investigating any bug, test failure, build error, or unexpected behavior — enforces root cause investigation before any fix attempt
---

# Systematic Debugging

## Overview

Disciplined approach to problem-solving that finds root causes before applying fixes.

**Core principle:** NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST. Applies to test failures, production bugs, performance problems, and build failures.

## Four-Phase Methodology

### Phase 1: Root Cause Investigation

1. Read error messages and stack traces carefully
2. Reliably reproduce the issue
3. Review recent changes in the affected area
4. Gather diagnostic data at component boundaries
5. Trace data flow backward through the call stack to find the origin

### Phase 2: Pattern Analysis

1. Locate similar working code in the codebase
2. Compare it thoroughly against the broken implementation
3. Understand dependencies and assumptions — don't skip details

### Phase 3: Hypothesis Testing

1. Form a specific hypothesis
2. Test it with a minimal change
3. Verify the result
4. If wrong: form a new hypothesis — don't layer fixes

### Phase 4: Implementation

1. Create a failing test case first
2. Implement a single targeted fix addressing the root cause
3. Verify the fix works without breaking other functionality

## Critical Safeguard

**After 3+ failed fix attempts:** Stop. The issue likely reflects architectural problems, not isolated bugs. Question the fundamentals rather than continuing to patch symptoms.

## When to Apply

Especially important under:
- Time pressure ("just fix it quickly")
- When "simple" solutions seem obvious
- After multiple failed attempts

These conditions make rushing most tempting and most costly.

## Red Flags

**Never:**
- Apply a fix before identifying the root cause
- Increase timeouts instead of finding real timing issues
- Layer multiple fixes without testing each
- Assume the first hypothesis is correct

**Always:**
- Reproduce before fixing
- One hypothesis, one test, one fix at a time
- Create a failing test before implementing the fix
- Verify fix doesn't break other functionality
