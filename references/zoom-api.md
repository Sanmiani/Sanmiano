# Zoom API Reference

Connects Zoom to your AIOS for meeting intelligence: pull recordings, transcripts, scheduled meetings, and participants.

---

## Step 1: Create a Server-to-Server OAuth App

Server-to-Server OAuth is best for AIOS automation — no user login required each time.

1. Go to: https://marketplace.zoom.us/
2. Sign in with your Zoom account
3. Click **Develop → Build App**
4. Choose **Server-to-Server OAuth** → **Create**
5. Name it: `Matt AIOS`
6. Copy your **Account ID**, **Client ID**, **Client Secret** — you'll need all three

### Add Required Scopes

In your app's **Scopes** tab, add:

| Scope | Why |
|---|---|
| `meeting:read:admin` | List and read meetings |
| `recording:read:admin` | Access cloud recordings |
| `user:read:admin` | Get your user info |
| `cloud_recording:read:admin` | Download transcripts |

Click **Continue** → **Activate your app**

---

## Step 2: Store Credentials

Add to `.env` in your AIOS root:

```
ZOOM_ACCOUNT_ID=your_account_id_here
ZOOM_CLIENT_ID=your_client_id_here
ZOOM_CLIENT_SECRET=your_client_secret_here
```

---

## Step 3: Test the Connection

```bash
python scripts/zoom_api.py
```

Expected output:
```
✅ Zoom connected
User: Matt Sanmiano (mattsanmiano@gmail.com)
Upcoming meetings: X
Recent recordings: X
```

---

## Common API Calls

### Get Access Token (auto-handled by script)

```
POST https://zoom.us/oauth/token
  ?grant_type=account_credentials
  &account_id={ZOOM_ACCOUNT_ID}
Authorization: Basic base64(CLIENT_ID:CLIENT_SECRET)
```

### List Your Meetings

```
GET https://api.zoom.us/v2/users/me/meetings
  ?type=upcoming
  &page_size=20
```

### Get Meeting Recordings

```
GET https://api.zoom.us/v2/users/me/recordings
  ?from=YYYY-MM-DD
  &to=YYYY-MM-DD
```

### Get a Specific Meeting's Recording

```
GET https://api.zoom.us/v2/meetings/{meetingId}/recordings
```

Returns: recording files including video MP4, audio M4A, and **transcript VTT** (if cloud transcription enabled)

### Download Transcript

The recording response includes a `download_url` for the VTT transcript file. Pass your access token as a query param:

```
GET {download_url}?access_token={token}
```

Save the `.vtt` file → feed into `meeting-insights-analyzer` skill.

### Create a Meeting

```
POST https://api.zoom.us/v2/users/me/meetings
Body: {
  "topic": "Meeting title",
  "type": 2,
  "start_time": "2026-05-12T10:00:00",
  "duration": 60,
  "timezone": "America/Toronto",
  "settings": {
    "auto_recording": "cloud"
  }
}
```

### List Meeting Participants

```
GET https://api.zoom.us/v2/report/meetings/{meetingId}/participants
```

---

## Enable Cloud Transcription

For `meeting-insights-analyzer` to work with Zoom, enable auto-transcription:

1. Zoom web portal → **Settings → Recording**
2. Enable **Cloud recording**
3. Enable **Audio transcript**
4. Save

After your next meeting ends, Zoom will auto-generate a VTT transcript in your recordings.

---

## Rate Limits

| Endpoint type | Limit |
|---|---|
| Most API calls | 30 req/sec per account |
| Recording downloads | No hard limit |
| Token refresh | Token expires every hour — script handles this |

---

## What Your AIOS Can Do with Zoom

| Use case | How |
|---|---|
| List this week's meetings | `zoom_api.py list_meetings` |
| Download transcripts | `zoom_api.py get_transcripts --days 7` |
| Feed transcript to meeting-insights-analyzer | Save VTT → run `/meeting-insights-analyzer` |
| Auto-schedule recurring meetings | `zoom_api.py create_meeting` |
| Get attendance from a meeting | `zoom_api.py participants --id {meetingId}` |

---

## Troubleshooting

| Error | Fix |
|---|---|
| `Invalid access token` | Token expired — script auto-refreshes, re-run |
| `Insufficient permissions` | Check app scopes in Marketplace, re-activate app |
| `Recording not found` | Cloud recording may still be processing (wait 10 min) |
| `No transcript` | Enable cloud transcription in Zoom settings first |
