---
name: verification-before-completion
description: Use before claiming any task, feature, or fix is complete — requires running fresh verification commands and showing actual output as proof
---

# Verification Before Completion

## Overview

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.**

Provide proof before making assertions about work status. This applies universally — tests, builds, configurations, deployments.

**Core principle:** Run it. Read the output. Then claim it.

## The Gate

Before claiming success:

1. **Identify** the verification command needed
2. **Run** the complete command freshly — not from memory or prior run
3. **Read** the full output and exit codes
4. **Verify** the output actually matches your claim
5. **Then claim** the result — with evidence

Skipping any step is misrepresentation, not efficiency.

## Red Flags — Stop and Verify

These signal you're about to make an unverified claim:

- Using conditional language: "should", "probably", "seems to"
- Expressing satisfaction before running verification
- Trusting agent success reports without independent confirmation
- Using partial checks ("linter passes" ≠ "build succeeds")
- Making assumptions based on related work passing

**If you catch yourself about to use "should work" — stop and run the command.**

## Common Verification Commands

```bash
# Tests
npm test / pytest / cargo test / go test ./...

# Build
npm run build / cargo build / go build ./...

# Type check
npx tsc --noEmit / mypy .

# Lint
eslint . / ruff check .
```

## What Counts as Evidence

**Acceptable:**
```
✅ Tests: 47 passed, 0 failed (0.8s)
✅ Build: compiled successfully in 2.3s
✅ [Paste of actual output showing success]
```

**Not acceptable:**
```
❌ "Tests should be passing now"
❌ "The build worked earlier"
❌ "I fixed the issue"
❌ Agent-reported success without re-running
```

## Why This Matters

Real failures from skipping verification:
- Undefined functions shipped to production
- Missing requirements passed review
- Broken trust with partners

**"Honesty is a core value. If you lie, you'll be replaced."**

## The Bottom Line

No shortcuts exist for verification. Run the command. Show the output. Then claim done.
