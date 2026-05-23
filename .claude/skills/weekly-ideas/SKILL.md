---
name: weekly-ideas
description: Generates 3 content ideas for the week and delivers them as a Gmail draft to Matt's inbox. Feeds directly into /sunday-batch.
invocation: /weekly-ideas
version: 1.0.0
author: Matt Sanmiano
bike-method-phase: 1  # Phase 1 — Training wheels. Run manually first. Advance only after 2-3 validated runs.
three-ms-attribution: |
  Adapted from The Three Ms of AI™ © 2026 Nate Herk.
---

# Weekly Ideas — Content Idea Pipeline

> *Adapted from The Three Ms of AI™. © 2026 Nate Herk. All rights reserved.*

## What this skill does

Generates 3 content ideas tailored for African men 35+ — each with an angle and a hook — and creates a Gmail draft to mattsanmiano@gmail.com. Run it Friday or Saturday. Read the draft Sunday. Pick one theme and feed it into `/sunday-batch`.

## Bike Method — Phase 1

This skill is at Phase 1. That means:
- **You trigger it manually** every week. No cron job yet.
- **You review the Gmail draft** before deciding which idea to use.
- **You validate quality** over 2-3 runs before any automation is added upstream.

Phase 2 upgrade (after validation): schedule via n8n to auto-run every Friday at 5pm.

---

## Execution — run when invoked

### Step 1 — Generate 5 candidate topics

Draw from the three content pillars:
- **Health** — Blood pressure, sleep, testosterone, nutrition, mental health, prostate health, diabetes, fitness after 35, sexual health, stress
- **AI & Tools** — Specific tools for productivity or health tracking, time-saving wins, AI for African men's real problems
- **Brotherhood** — Community stories, accountability culture, African men in diaspora, silence around men's health, modern fatherhood

Rules for topic generation:
- Each topic must be specific to African men 35+ — not generic "men's health"
- At least one topic must reference a real stat or data point (e.g. "African men are 70% less likely to seek mental health support")
- At least one topic must tie to AI tools or modern approaches
- Rotate pillars — don't generate 3 Health topics in a row

### Step 2 — Filter to the 3 strongest

Score each candidate on:
1. **Audience specificity** — does it speak directly to African men 35+, or could it be for anyone?
2. **Hook potential** — can this open with a pattern interrupt or bold stat?
3. **Action angle** — does it give the audience something to do, track, or change?

Drop the 2 weakest. Keep the 3 strongest.

### Step 3 — Develop each idea

For each of the 3 ideas, write:

```
IDEA [N]
Topic: [clear topic name]
Pillar: [Health / AI & Tools / Brotherhood]
Angle: [1-2 sentences — why this hits for African men 35+. Be specific. Reference a stat if possible.]
Hook: [1 sentence — opening line ready to drop straight into /sunday-batch. Pattern interrupt or bold claim.]
```

### Step 4 — Format the email brief

Compose the full email:

**Subject:** Weekly Content Ideas — Week of [current date range, e.g. May 18–24, 2026]

**Body:**

```
Brothers — here are your 3 ideas for the week.

Pick one, drop it into /sunday-batch, and you're done.

---

IDEA 1
Topic: [topic]
Pillar: [pillar]
Angle: [angle]
Hook: [hook]

---

IDEA 2
Topic: [topic]
Pillar: [pillar]
Angle: [angle]
Hook: [hook]

---

IDEA 3
Topic: [topic]
Pillar: [pillar]
Angle: [angle]
Hook: [hook]

---

Next step: pick your favourite → run /sunday-batch → paste the topic + hook when prompted.

Strong After 35 · AIOS
```

### Step 5 — Create the Gmail draft

Use the Gmail MCP to create a draft:
- **To:** mattsanmiano@gmail.com
- **Subject:** Weekly Content Ideas — Week of [date range]
- **Body:** the formatted brief above

After creating the draft, confirm to Matt in chat:

> "Done. Draft is in your Gmail. Open it Sunday, pick one idea, and run `/sunday-batch` with the topic. That's the whole workflow."

---

## What NOT to generate

- Generic "5 tips for men" topics with no African-specific angle
- Topics without a clear hook potential
- Three topics from the same pillar in one run
- Vague angles like "mental health is important" — must be specific and data-backed

---

## Phase 2 upgrade path (do not build until Phase 1 has run 2-3 times)

Once quality is validated:
1. Add web search step (Brave Search MCP) to pull current health/AI news before generating ideas
2. Schedule via n8n to auto-run every Friday at 5pm and auto-send (not just draft)
3. Pull last 4 weeks of topics from decisions log to avoid repeating themes
