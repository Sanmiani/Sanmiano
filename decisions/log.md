# Decisions Log

Append-only record of meaningful decisions and why they were made. `/level-up` Phase 2 (Method interview) writes scoped automation specs here. You can also append manually whenever you decide something worth remembering.

**Format per entry:**

```
## YYYY-MM-DD — Short title

**Decision:** what was decided.

**Why:** the reasoning, constraints, and what would change your mind.

**Alternatives considered:** what else was on the table.

**Owner:** who's accountable.
```

Keep it terse. Future-you will thank present-you for capturing the *why*, not just the *what*.

---

## 2026-05-13 — Content Posting Pack + Buffer Setup

**Decision:** Build a companion prompt (posting-pack) that takes the triple-script output and produces an Instagram caption, LinkedIn post, weekly schedule, and Buffer paste checklist — plus a one-time Buffer setup to schedule posts across all three platforms from one place.

**Automation spec:**
- Trigger: Triple-script output exists for a topic
- Data in: Triple-script output (Facebook post + Reel script + Substack draft)
- Transformations: Extract social content → generate Instagram caption + LinkedIn post → build posting schedule → produce Buffer checklist
- Decision point: Matt reviews all outputs before loading into Buffer
- Destination: Buffer (schedules to Facebook, Instagram, LinkedIn automatically)
- Autonomy level: L2 — AI drafts, Matt reviews and approves
- KPI bucket: More customers (audience growth)
- Metric: Posts published per week — target 3x, currently inconsistent

**Why:** Content exists but posting was still manual and multi-platform. This closes the gap between "content written" and "content live." Buffer eliminates the triple-login. The posting-pack prompt fills the two missing pieces (Instagram caption + LinkedIn post) the triple-script doesn't produce.

**Alternatives considered:** n8n → Meta + LinkedIn auto-publish (highest leverage, blocked on API setup — Phase 2 upgrade once Meta Graph API and LinkedIn API are connected).

**Owner:** Matt

**Artifacts:**
- `prompts/content-posting-pack.md`
- `references/buffer-setup.md`

---

## 2026-05-18 — Weekly Content Idea Pipeline (Gmail Brief)

**Decision:** Build a `/weekly-ideas` skill that generates 3 content ideas each week and delivers them as a Gmail draft to mattsanmiano@gmail.com — ready to read by Sunday.

**Automation spec:**
- Trigger: Manual — Matt runs `/weekly-ideas` each week (Friday or Saturday)
- Data sources: Claude's knowledge of health + AI trends relevant to African men 35+; content pillars (Health, AI & Tools, Brotherhood)
- Transformations: Generate 5 candidate topics → filter to 3 strongest by audience fit → add angle + hook per topic → format as clean email brief
- Decision point: Matt reads the draft, picks which topic to feed into `/sunday-batch`
- Destination: Gmail draft to mattsanmiano@gmail.com
- Autonomy level: L2 — AI drafts, Matt reviews and picks
- KPI bucket: More customers (audience growth)
- Metric: 3 content ideas ready by Sunday every week

**Why:** The triple-script and sunday-batch are built and ready, but Matt still starts each week with a blank page for topics. This closes the upstream gap. One command → ideas in inbox → `/sunday-batch` runs from a real brief, not guesswork.

**Alternatives considered:** Prompt-only (too manual — Gmail creation is the friction point); n8n scheduled trigger (Phase 2 upgrade — ship manual-trigger first, automate the trigger once quality is validated).

**Owner:** Matt

**Artifact:** `.claude/skills/weekly-ideas/SKILL.md`

---

## 2026-05-10 — One-Topic → Three-Script Content Generator

**Decision:** Build a prompt template that takes one topic and outputs a Facebook post, Instagram Reel script, and Substack full article draft — all voice-matched to Matt's register.

**Automation spec:**
- Trigger: Matt has a content topic/idea
- Data in: Topic + voice guide + platform rules + audience context (African men 35+)
- Transformations: Topic → Facebook post (community tone, checklist, hashtags) + Instagram Reel script (hook, body, CTA) + Substack full article (educational, personal, deeper)
- Decision point: Matt reviews and edits before posting
- Destination: Copy-paste and publish per platform
- Autonomy level: L2 — AI drafts, Matt reviews and edits
- KPI bucket: More customers (audience growth)
- Metric: Posts published per week — target 3x, currently inconsistent

**Why:** Content scripting across three platforms is the #1 time-suck and the primary blocker to consistent 3x/week posting. One prompt collapses three separate writing sessions into one review.

**Alternatives considered:** Weekly batch prompt (higher leverage but more complex — Phase 2 upgrade); Content idea finder (useful but feeds this, not a standalone).

**Owner:** Matt

**Artifact:** `prompts/content-triple-script.md`

---
