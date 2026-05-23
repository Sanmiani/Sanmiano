# Notion CRM — Database Schema

Create a full-page Notion database called **"Lead CRM"** with the following properties.

---

## Properties

| Property Name | Property Type | Options / Notes |
|---|---|---|
| **Name** | Title | Auto-created. Format: "First Last" |
| **Company** | Text | |
| **Job Title** | Text | |
| **Email** | Email | |
| **LinkedIn URL** | URL | |
| **Source** | Select | LinkedIn, Google, Referral, Event, Cold List, Other |
| **Status** | Select | See Status Options below |
| **Last Contact Date** | Date | Date only (no time) |
| **Follow-up Date** | Date | Date only — when next follow-up should fire |
| **Follow-up Count** | Number | Starts at 0. Auto-incremented by workflow |
| **Reply Received** | Checkbox | Checked by reply-detection workflow |
| **Email Subject** | Text | Auto-filled by outreach workflow |
| **Notes** | Text | Your manual notes |
| **Lead Score** | Number | 1–10. Fill manually after qualifying |
| **Tags** | Multi-select | Add custom tags as needed |
| **Created** | Created time | Auto |

---

## Status Options (in order)

Add these exact status values in this order (used by workflows to filter):

1. `New` — Lead imported, not yet reviewed
2. `Ready to Email` — Reviewed, approved for outreach
3. `Email Sent` — First cold email sent
4. `Follow-up 1 Sent` — Day 3 follow-up sent
5. `Follow-up 2 Sent` — Day 7 follow-up sent
6. `Break-up Sent` — Day 14 break-up email sent
7. `Replied` — Lead has replied (auto-set by workflow)
8. `Qualified` — Replied and confirmed as good fit
9. `Proposal Sent` — Proposal or deck shared
10. `Call Booked` — Discovery call scheduled
11. `Won` — Client signed
12. `Lost` — Did not convert
13. `Do Not Contact` — Unsubscribed or bounced

---

## Recommended Views

Create these saved views in your database:

### View 1: "Action Required" (Today's work)
- Filter: Status = "Replied" OR Status = "Qualified" OR Status = "Call Booked"
- Sort: Last Contact Date (oldest first)

### View 2: "Pipeline" (Active outreach)
- Filter: Status is one of [Ready to Email, Email Sent, Follow-up 1 Sent, Follow-up 2 Sent]
- Sort: Follow-up Date (ascending)

### View 3: "Won Clients"
- Filter: Status = "Won"
- Sort: Created (newest first)

### View 4: "All Leads"
- No filter
- Sort: Created (newest first)

---

## Board View (Kanban)

Create a Board view grouped by **Status** — gives you a visual pipeline at a glance.

Drag columns left-to-right to match the flow:
`New → Ready to Email → Email Sent → Follow-up 1 → Follow-up 2 → Break-up → Replied → Qualified → Proposal → Call Booked → Won`
