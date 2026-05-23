# The `onboard` Skill — Day 1 Setup for AIS-OS

## What It Does

The `/onboard` skill is a combined wizard for first-time AIS-OS users. It runs a 7-question intake interview, writes answers to `aios-intake.md`, then scaffolds a starter file set (context files, voice samples, connections map, and system prompt). It's idempotent—re-run it anytime after editing the intake.

## Core Flow

**Step 1: Intake Check**
- If all 7 questions are filled → skip to scaffolding
- If some are answered → let the user choose: fill the rest or scaffold from what exists
- If blank (fresh clone) → begin the interview

**Step 2: The 7-Question Interview**

The questions proceed one at a time:

1. **Identity & Offer** — Who are you, what do you sell, to whom?
2. **Voice Samples** — Paste 1–2 unedited pieces (email or post). This is non-negotiable; if the user types prose mid-conversation, refuse and require a paste from real writing.
3. **90-Day Priorities** — Your 2–3 top goals. Push back on vague answers; demand numbers, deadlines, or deliverables.
4. **Revenue & Tracking** — Where money lands and how you track it.
5. **Communication Channels** — Email, chat, DMs—where you talk to customers, team, and the world.
6. **Documents & Recordings** — Where meeting notes and important files live.
7. **Weekly Pain & Task Tracking** — The one task eating your week and where you track work.

Domain 3 (Calendar) auto-infers from Q5; confirm in Step 3.

**Step 3: Scaffold the Day-1 File Set**

Generate (or update, with backups):
- `context/about-me.md` — from Q1 + Q7
- `context/about-business.md` — from Q1 + Q4
- `context/priorities.md` — from Q3 (numbered list)
- `references/voice.md` — Q2 samples, verbatim, with register notes
- `connections.md` — 7-row table from Q4–Q7; each row marked "not yet connected"
- `CLAUDE.md` — system prompt with all `{{...}}` placeholders filled

**Step 4: Closing Screen** (3 lines max)

```
✓ Day 1 done. Your AIOS knows who you are, what you sell, what matters 
this quarter, and how you sound.

Today: ask me — "what should I focus on this week?"
Tomorrow: wire one tool from connections.md.
Day 7: run /audit.
```

## The Wow Moment

When the user runs the closing prompt—"what should I focus on this week?"—the skill responds with a 3-bullet priority list tied to their Q3 goals, written in their voice (Q2 register), and closes with a **Default Shift question**: "To what extent could AI be leveraged on this task?" This plants the Mindset framework before `/level-up` formally introduces it on Day 14.

## Non-Negotiable Rules

1. **7 questions, hard cap.** No Q8.
2. **Voice paste rule.** Refuse typed samples; demand real writing pasted fresh.
3. **One-shot scaffold.** No multi-turn confirmation after Step 2.
4. **Idempotency.** Re-run with edited intake; old files back up to `archives/intake-{timestamp}/`.
5. **Closing screen is exactly 3 lines.**
6. **No extra skills.** Don't scaffold `/today`, `/draft`, `/connect`.
7. **No `.env` writes.** Day 1 is intake only; Day 2 wires connections.
