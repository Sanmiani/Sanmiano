# Calendly API v2 Reference

**Base URL:** `https://api.calendly.com`

## Auth

Calendly uses **Personal Access Tokens** (PAT) for internal/single-account use. Generate one at:
**calendly.com → Integrations → API & Webhooks → Personal Access Tokens**

All requests:
```
Authorization: Bearer <your-pat>
Content-Type: application/json
```

Store in `.env` as `CALENDLY_PAT=` (not yet added — add when connected).

**OAuth 2.1** is for multi-user public apps — not needed for Matt's AIOS.

---

## First Call: Get Your User URI

Almost every endpoint requires your user or organization URI as a filter. Get it once:

```python
import requests, os

headers = {"Authorization": f"Bearer {os.getenv('CALENDLY_PAT')}"}
me = requests.get("https://api.calendly.com/users/me", headers=headers).json()

user_uri = me["resource"]["uri"]          # e.g. https://api.calendly.com/users/abc123
org_uri  = me["resource"]["current_organization"]  # e.g. https://api.calendly.com/organizations/xyz
```

Save both — you'll pass them as query params to most list endpoints.

---

## Key Endpoints

### Users

| Method | Path | What it does |
|---|---|---|
| `GET` | `/users/me` | Your profile, timezone, scheduling URL, org URI |
| `GET` | `/users/{uuid}` | Any user's profile |

### Event Types (your booking pages)

| Method | Path | What it does |
|---|---|---|
| `GET` | `/event_types` | List all your event types (coaching calls, community sessions, etc.) |
| `GET` | `/event_types/{uuid}` | One event type's detail |
| `GET` | `/event_type_available_times` | Available slots for a specific event type |

```python
# List your event types
params = {"user": user_uri, "active": "true"}
r = requests.get("https://api.calendly.com/event_types", headers=headers, params=params)
event_types = r.json()["collection"]
```

**Available times (requires event type URI + date range):**
```python
params = {
    "event_type": "https://api.calendly.com/event_types/<uuid>",
    "start_time": "2026-05-18T00:00:00Z",
    "end_time":   "2026-05-25T00:00:00Z"
}
r = requests.get("https://api.calendly.com/event_type_available_times",
                 headers=headers, params=params)
```

### Scheduled Events (booked meetings)

| Method | Path | What it does |
|---|---|---|
| `GET` | `/scheduled_events` | List upcoming/past bookings |
| `GET` | `/scheduled_events/{uuid}` | Single event detail |
| `GET` | `/scheduled_events/{uuid}/invitees` | Who booked this event (name, email, answers) |
| `POST` | `/scheduled_events/{uuid}/cancellation` | Cancel a booked event |

```python
# Upcoming bookings in the next 7 days
from datetime import datetime, timedelta, timezone

now    = datetime.now(timezone.utc).isoformat()
in_7d  = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()

params = {
    "user":       user_uri,
    "status":     "active",       # active | canceled
    "min_start_time": now,
    "max_start_time": in_7d,
    "sort":       "start_time:asc"
}
r = requests.get("https://api.calendly.com/scheduled_events", headers=headers, params=params)
events = r.json()["collection"]
```

**Cancel an event:**
```python
payload = {"reason": "Matt had a scheduling conflict"}
requests.post(
    f"https://api.calendly.com/scheduled_events/{uuid}/cancellation",
    headers=headers, json=payload
)
```

### Webhooks (real-time event notifications)

| Method | Path | What it does |
|---|---|---|
| `GET` | `/webhook_subscriptions` | List active webhooks |
| `POST` | `/webhook_subscriptions` | Create a webhook |
| `DELETE` | `/webhook_subscriptions/{uuid}` | Remove a webhook |

**Events you can subscribe to:**
- `invitee.created` — someone books
- `invitee.canceled` — someone cancels
- `routing_form_submission.created` — intake form submitted

```python
payload = {
    "url": "https://your-n8n-webhook-url/webhook/calendly",
    "events": ["invitee.created", "invitee.canceled"],
    "organization": org_uri,
    "user": user_uri,
    "scope": "user"   # "user" or "organization"
}
requests.post("https://api.calendly.com/webhook_subscriptions",
              headers=headers, json=payload)
```

---

## Pagination

List responses return:
```json
{
  "collection": [...],
  "pagination": {
    "count": 20,
    "next_page": "https://api.calendly.com/scheduled_events?page_token=abc",
    "next_page_token": "abc",
    "previous_page": null
  }
}
```

Pass `?page_token=<token>` for the next page. Default page size is 20, max is 100 (`?count=100`).

---

## Matt's Use Cases

| What you want | How |
|---|---|
| See who's booked this week | `GET /scheduled_events` with `status=active` + date range |
| Get a booker's email/answers | `GET /scheduled_events/{uuid}/invitees` |
| Check open slots for a session type | `GET /event_type_available_times` |
| Cancel a booking | `POST /scheduled_events/{uuid}/cancellation` |
| Get notified instantly when someone books | `POST /webhook_subscriptions` → fires to n8n webhook |

---

## Notes

- Webhooks require a **paid Calendly plan** (Standard or above).
- All URIs are full URLs (e.g. `https://api.calendly.com/users/abc123`), not just IDs — always pass the full URI as the filter param.
- The **Scheduling API** (newer, 2025) lets you build native booking flows without Calendly's hosted UI — useful if you ever want booking embedded in your website. Separate docs at developer.calendly.com.

**Docs:** https://developer.calendly.com/api-docs
