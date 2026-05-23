"""
Zoom API client for AIOS meeting intelligence.
Requires: pip install requests python-dotenv

Setup: Add ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET to .env
Docs: references/zoom-api.md
"""

import os
import base64
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

ZOOM_ACCOUNT_ID = os.getenv("ZOOM_ACCOUNT_ID")
ZOOM_CLIENT_ID = os.getenv("ZOOM_CLIENT_ID")
ZOOM_CLIENT_SECRET = os.getenv("ZOOM_CLIENT_SECRET")
BASE_URL = "https://api.zoom.us/v2"


def get_access_token():
    """Fetch a fresh Server-to-Server OAuth access token."""
    credentials = base64.b64encode(
        f"{ZOOM_CLIENT_ID}:{ZOOM_CLIENT_SECRET}".encode()
    ).decode()

    response = requests.post(
        "https://zoom.us/oauth/token",
        params={
            "grant_type": "account_credentials",
            "account_id": ZOOM_ACCOUNT_ID,
        },
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    response.raise_for_status()
    return response.json()["access_token"]


def get_headers():
    return {"Authorization": f"Bearer {get_access_token()}"}


def get_current_user():
    """Get your Zoom user profile."""
    r = requests.get(f"{BASE_URL}/users/me", headers=get_headers())
    r.raise_for_status()
    return r.json()


def list_meetings(meeting_type="upcoming", page_size=20):
    """
    List meetings.
    meeting_type: 'upcoming', 'live', 'scheduled', 'previous_meetings'
    """
    r = requests.get(
        f"{BASE_URL}/users/me/meetings",
        headers=get_headers(),
        params={"type": meeting_type, "page_size": page_size},
    )
    r.raise_for_status()
    return r.json().get("meetings", [])


def list_recordings(days_back=7):
    """List cloud recordings from the past N days."""
    end = datetime.now()
    start = end - timedelta(days=days_back)

    r = requests.get(
        f"{BASE_URL}/users/me/recordings",
        headers=get_headers(),
        params={
            "from": start.strftime("%Y-%m-%d"),
            "to": end.strftime("%Y-%m-%d"),
            "page_size": 30,
        },
    )
    r.raise_for_status()
    return r.json().get("meetings", [])


def get_meeting_recordings(meeting_id):
    """Get all recording files for a specific meeting."""
    r = requests.get(
        f"{BASE_URL}/meetings/{meeting_id}/recordings",
        headers=get_headers(),
    )
    r.raise_for_status()
    return r.json()


def download_transcript(meeting_id, output_dir="transcripts"):
    """
    Download the VTT transcript for a meeting.
    Saves to transcripts/{meeting_id}.vtt
    Compatible with meeting-insights-analyzer skill.
    """
    os.makedirs(output_dir, exist_ok=True)

    recording_data = get_meeting_recordings(meeting_id)
    recording_files = recording_data.get("recording_files", [])

    token = get_access_token()
    saved = []

    for file in recording_files:
        if file.get("file_type") == "TRANSCRIPT":
            url = file["download_url"]
            topic = recording_data.get("topic", "meeting").replace(" ", "_")
            date = recording_data.get("start_time", "")[:10]
            filename = f"{output_dir}/{date}_{topic}_{meeting_id}.vtt"

            r = requests.get(url, params={"access_token": token})
            r.raise_for_status()

            with open(filename, "w", encoding="utf-8") as f:
                f.write(r.text)

            saved.append(filename)
            print(f"  Saved: {filename}")

    if not saved:
        print(f"  No transcript found for meeting {meeting_id}")
        print("  Tip: Enable cloud transcription in Zoom Settings → Recording")

    return saved


def download_all_recent_transcripts(days_back=7, output_dir="transcripts"):
    """Download transcripts from all recent meetings. Feed output to meeting-insights-analyzer."""
    recordings = list_recordings(days_back=days_back)

    if not recordings:
        print(f"No recordings found in the past {days_back} days.")
        return []

    all_saved = []
    for meeting in recordings:
        meeting_id = meeting["uuid"]
        topic = meeting.get("topic", "Unknown")
        print(f"\nMeeting: {topic}")
        saved = download_transcript(meeting_id, output_dir=output_dir)
        all_saved.extend(saved)

    return all_saved


def get_meeting_participants(meeting_id):
    """Get participant report for a completed meeting."""
    r = requests.get(
        f"{BASE_URL}/report/meetings/{meeting_id}/participants",
        headers=get_headers(),
        params={"page_size": 100},
    )
    r.raise_for_status()
    return r.json().get("participants", [])


def create_meeting(topic, start_time, duration_minutes=60, auto_record=True):
    """
    Create a Zoom meeting.
    start_time format: 'YYYY-MM-DDTHH:MM:SS' (America/Toronto timezone)
    """
    body = {
        "topic": topic,
        "type": 2,
        "start_time": start_time,
        "duration": duration_minutes,
        "timezone": "America/Toronto",
        "settings": {
            "auto_recording": "cloud" if auto_record else "none",
            "waiting_room": False,
            "join_before_host": True,
        },
    }

    r = requests.post(
        f"{BASE_URL}/users/me/meetings",
        headers={**get_headers(), "Content-Type": "application/json"},
        json=body,
    )
    r.raise_for_status()
    meeting = r.json()
    return {
        "id": meeting["id"],
        "topic": meeting["topic"],
        "join_url": meeting["join_url"],
        "start_time": meeting["start_time"],
    }


def test_connection():
    """Verify credentials and print account summary."""
    print("Testing Zoom connection...")

    if not all([ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET]):
        print("❌ Missing credentials. Add to .env:")
        print("   ZOOM_ACCOUNT_ID=...")
        print("   ZOOM_CLIENT_ID=...")
        print("   ZOOM_CLIENT_SECRET=...")
        return False

    try:
        user = get_current_user()
        print(f"✅ Zoom connected")
        print(f"   User: {user.get('first_name')} {user.get('last_name')} ({user.get('email')})")
        print(f"   Account type: {user.get('type')}")

        upcoming = list_meetings("upcoming")
        print(f"   Upcoming meetings: {len(upcoming)}")
        for m in upcoming[:3]:
            start = m.get("start_time", "")[:16].replace("T", " ")
            print(f"     • {m['topic']} — {start}")

        recordings = list_recordings(days_back=7)
        print(f"   Recordings (last 7 days): {len(recordings)}")

        return True

    except requests.exceptions.HTTPError as e:
        print(f"❌ API error: {e.response.status_code} — {e.response.text}")
        print("   Check your app scopes in Zoom Marketplace.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        test_connection()
    elif sys.argv[1] == "list":
        meetings = list_meetings("upcoming")
        for m in meetings:
            print(f"{m['start_time'][:16]}  {m['topic']}")
    elif sys.argv[1] == "recordings":
        days = int(sys.argv[2]) if len(sys.argv) > 2 else 7
        recs = list_recordings(days_back=days)
        for r in recs:
            print(f"{r['start_time'][:10]}  {r['topic']}  ({r.get('total_size', 0) // 1024 // 1024} MB)")
    elif sys.argv[1] == "transcripts":
        days = int(sys.argv[2]) if len(sys.argv) > 2 else 7
        saved = download_all_recent_transcripts(days_back=days)
        print(f"\n{len(saved)} transcript(s) saved to transcripts/")
        print("Feed them to /meeting-insights-analyzer for communication analysis.")
    else:
        print("Usage: python zoom_api.py [list|recordings|transcripts] [days]")
