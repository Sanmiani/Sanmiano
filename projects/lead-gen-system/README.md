# Plug-and-Play Lead Generation System

A fully automated client acquisition pipeline built on n8n, Notion, Gmail, and Google Sheets.

## System Overview

```
PROSPECT LIST (Google Sheets)
        ↓
  [01] Lead Import Workflow
        ↓
  NOTION CRM DATABASE
        ↓
  [02] Email Outreach Workflow  ←── Daily: sends cold emails to "Ready to Email" leads
        ↓
  [03] Follow-up Sequence      ←── Daily: Day 3, Day 7, Day 14 follow-ups
        ↓
  [04] Reply Detection          ←── Every 2hrs: scans Gmail, marks replied leads
        ↓
  QUALIFIED LEAD → Book call → Close
```

## What's Automated

| Workflow | When It Runs | What It Does |
|---|---|---|
| Lead Import | Hourly | Pulls new rows from Google Sheets → Notion CRM |
| Email Outreach | Daily 9am (Mon–Fri) | Sends personalised cold emails to ready leads |
| Follow-up Sequence | Daily 9:30am (Mon–Fri) | Sends follow-up 1/2/break-up based on days elapsed |
| Reply Detection | Every 2 hours | Scans Gmail inbox, marks replied leads, alerts you |

## Notion CRM Status Flow

```
New → Ready to Email → Email Sent → Follow-up 1 Sent → Follow-up 2 Sent → Break-up Sent
                                 ↘
                               Replied → Qualified → Proposal Sent → Won / Lost
```

## Files in This Project

```
lead-gen-system/
├── README.md                       ← You are here
├── SETUP.md                        ← Step-by-step setup guide (start here)
├── notion-crm-setup.md             ← Notion database schema
├── templates/
│   └── email-sequences.md          ← All cold email + follow-up copy
└── workflows/
    ├── 01-lead-import.json         ← Import to Notion (Google Sheets trigger)
    ├── 02-email-outreach.json      ← Cold email sender
    ├── 03-follow-up-sequence.json  ← Follow-up automation
    └── 04-reply-detection.json     ← Gmail reply scanner
```

## Quick Start

1. Read `SETUP.md` and complete all 5 setup steps
2. Import all 4 workflow JSON files into n8n
3. Configure credentials in each workflow (Notion, Gmail, Google Sheets)
4. Paste your Notion database ID into each workflow
5. Add your first 10 leads to the Google Sheet
6. Set leads to "Ready to Email" status in Notion
7. Activate workflows 02, 03, 04 — let 01 run on schedule

## Capacity (Default Settings)

- **10 emails/day** max (safe for Gmail deliverability)
- Follow-up gaps: Day 3, Day 7, Day 14
- Workflows run Mon–Fri only
