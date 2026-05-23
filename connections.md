# Connections

Registry of every system your AIOS can reach. `/audit` checks this file for domain coverage and freshness.

| # | Domain | Tool | Mechanism | Auth | Last checked |
|---|---|---|---|---|---|
| 1 | Revenue / Financials | Bank transfer (salary only) | not yet connected | — | — |
| 2 | Customer interactions | Gmail, Instagram DMs, Facebook Messenger | mcp (Gmail) | claude.ai OAuth | 2026-05-09 |
| 3 | Calendar | Google Calendar | mcp | claude.ai OAuth | 2026-05-09 |
| 4 | Communication | Gmail, WhatsApp, Instagram, LinkedIn, Facebook | mcp (Gmail) | claude.ai OAuth | 2026-05-09 |
| 5 | Project / task tracking | Notion | mcp | claude.ai OAuth | 2026-05-09 |
| 6 | Meeting intelligence | Zoom | key+ref + script | .env credentials | pending setup |
| 7 | Knowledge / files | Google Drive, Notion | mcp | claude.ai OAuth | 2026-05-09 |

---

## Connected (live via Claude Code MCPs)

| Tool | What it can do for you | Reference |
|---|---|---|
| **Gmail** | Read/draft emails, search threads, label and organise | `references/gmail-api.md` |
| **Google Calendar** | Read/create/update events, suggest meeting times | `references/google-calendar-api.md` |
| **Google Drive** | Search, read, create, copy files | `references/google-drive-api.md` |
| **Canva** | Generate designs, edit content, export visuals | `references/canva-api.md` |
| **Notion** | Read/create/update pages and databases | `references/notion-api.md` |
| **Gamma** | Generate presentations, docs, and web pages with AI | `references/gamma-api.md` |
| **Calendly** | Manage scheduling, event types, availability | — |
| **Zoom** *(pending credentials)* | List meetings, download recordings + transcripts, create meetings | `references/zoom-api.md` |

---

## Not yet connected (priority order for your goals)

| Priority | Tool | Why it matters | How to connect |
|---|---|---|---|
| 🔴 HIGH | Meta Graph API (Instagram + Facebook) | Schedule posts, pull analytics, manage your Page | `references/meta-graph-api.md` |
| 🔴 HIGH | LinkedIn API | Publish posts, track engagement | `references/linkedin-api.md` |
| 🟡 MED | Brave Search MCP | Research topics, find stats, fact-check content ideas | See `.claude/settings.json` |
| 🟢 DONE | n8n | Workflow automation layer — connects Claude to social platforms, scheduling, and more | `.mcp.json` + `settings.local.json` env |
| 🟡 MED | Buffer or Later API | Cross-platform post scheduling from one place | Add once Meta + LinkedIn are wired |
| 🔴 HIGH | Telegram Bot API | Broadcast content, build community channel, send health tips | `references/telegram-api.md` |
| 🟢 LOW | WhatsApp Business API | Engage community members via WhatsApp | Future — needs business account |

---

**Mechanism options:** `mcp` (MCP server), `script` (Python/Bash hitting an API, in `scripts/`), `export` (CSV/JSON dump pipeline), `key+ref` (`.env` key + `references/{tool}-api.md` guide), `not yet connected`.
