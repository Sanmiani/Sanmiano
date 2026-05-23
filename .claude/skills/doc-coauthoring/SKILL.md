---
name: doc-coauthoring
description: Use this skill when the user wants to collaboratively write a document — proposals, specs, decision docs, reports. Three-stage process: context, structure, reader testing.
license: MIT
---

# Doc Co-Authoring Skill

This skill guides collaborative document creation through three structured stages.

## When to Trigger

User mentions writing documentation, proposals, specs, decision docs, or any substantial writing task.

## Three-Stage Process

### Stage 1 — Context Gathering

User provides background while you ask clarifying questions:
- Document type, audience, desired impact, format constraints
- Encourage "dumping" all relevant context
- Close knowledge gaps before drafting

### Stage 2 — Refinement & Structure

Build section-by-section through:
1. Clarifying questions about content
2. Brainstorm 5-20 options per section
3. User curates ideas
4. Gap check
5. Draft
6. Iterative refinement using surgical edits (never full rewrites)

**Key rules:**
- Use artifacts/files to create document scaffolds with all section headers
- Apply `str_replace` for edits — never reprint entire documents
- Provide artifact links after each modification
- After three consecutive iterations without substantial changes, ask what can be removed
- Review complete document for coherence, flow, and redundancy near completion

### Stage 3 — Reader Testing

Test with a fresh perspective to catch blind spots:
- Predict reader questions
- Test comprehension
- Check for ambiguity
- Iterate based on findings

## Key Principles

- Quality takes priority over speed
- User agency throughout — they can skip stages, work freeform, or adjust the process
- Surgical edits only: never reprint entire documents
- Ask "what can be removed?" — the best documents are concise
