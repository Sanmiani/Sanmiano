# Setup Guide — Lead Gen System

Complete these steps in order before activating any workflow.

---

## Step 1 — Create the Notion CRM Database

See `notion-crm-setup.md` for the full database schema.

1. Open Notion → New page → "Lead CRM"
2. Add a full-page **Database** (Table view)
3. Add all properties listed in `notion-crm-setup.md`
4. Copy the **Database ID** from the URL:
   - URL format: `https://notion.so/yourworkspace/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX?v=...`
   - The 32-character string between the last `/` and `?v=` is your Database ID
   - Save it: `NOTION_DATABASE_ID = ______________________`

---

## Step 2 — Create the Google Sheets Lead List

Create a new Google Sheet named **"Lead Gen - Prospects"** with these exact column headers in Row 1:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| First Name | Last Name | Company | Job Title | Email | LinkedIn URL | Notes | Imported |

- Column H (`Imported`) stays blank — the workflow fills it with "YES" after importing
- Make a note of the **Spreadsheet ID** from the URL:
  - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
  - Save it: `GOOGLE_SHEET_ID = ______________________`
- Sheet tab name should be: `Leads`

---

## Step 3 — Set Up Gmail Labels

In Gmail, create two labels:
1. `lead-gen/outreach` — for emails you send via the system
2. `lead-gen/replied` — the system will auto-label replies here

You'll also need a **Gmail signature** to identify outreach threads:
- Add `<!-- lead-gen-thread -->` as a hidden HTML comment in your signature (used for reply detection)

---

## Step 4 — Configure n8n Credentials

In your n8n instance (`https://lufnet.app.n8n.cloud`), ensure these credentials exist:

| Credential Name | Type | Notes |
|---|---|---|
| `Notion API` | Notion API | Should already exist from AIOS setup |
| `Gmail OAuth2` | Gmail OAuth2 | Create if not exists |
| `Google Sheets OAuth2` | Google Sheets OAuth2 | Create if not exists |

To add a new credential: n8n → Settings → Credentials → Add Credential

---

## Step 5 — Import and Configure Workflows

For each workflow JSON in `workflows/`:

1. n8n → Workflows → Import from file
2. Select the JSON file
3. Open the workflow and update **every orange node** (these need your IDs/credentials)
4. Replace all placeholder values:

| Placeholder | Replace With |
|---|---|
| `YOUR_NOTION_DATABASE_ID` | Your Notion Database ID from Step 1 |
| `YOUR_GOOGLE_SHEET_ID` | Your Spreadsheet ID from Step 2 |
| `YOUR_EMAIL` | mattsanmiano@gmail.com |
| `YOUR_NAME` | Matt Okewusi |
| `YOUR_CALENDLY_LINK` | Your Calendly booking link |

5. Set credentials on each node that requires them
6. **Save** each workflow
7. **Activate** workflows 02, 03, and 04 only
   - Workflow 01 runs on a schedule — activate it too
   - Do NOT manually trigger outreach workflows on first setup until you've reviewed the lead list

---

## Step 6 — First Run Test

1. Add 1 test lead to the Google Sheet (use your own email)
2. Manually trigger **Workflow 01** — check that a Notion page was created
3. In Notion, change the test lead status to **"Ready to Email"**
4. Manually trigger **Workflow 02** — verify you receive the email
5. If both work, the system is live

---

## Daily Monitoring (5 minutes/day)

- Check Notion CRM for any "Replied" leads — these need your personal attention
- Review the Gmail `lead-gen/replied` label for new threads
- Move qualified leads to "Qualified" status and book a call

---

## Scaling Up

- Start with 5–10 leads/day max for the first 2 weeks (Gmail warmup)
- Increase to 20–30/day after 2 weeks with no deliverability issues
- Add new leads to the Google Sheet continuously — the import workflow handles the rest
