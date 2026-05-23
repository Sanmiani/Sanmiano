# Telegram Bot API — Setup Guide

**Status:** Not yet connected
**What it unlocks:** Broadcast content to a Telegram channel/group, receive messages, automate community updates.
**Priority:** HIGH — Telegram is one of the fastest-growing community platforms for African diaspora audiences

---

## What you'll be able to do once connected

| Action | Use case |
|---|---|
| Send messages to a channel/group | Broadcast posts, health tips, announcements |
| Share media (images, videos) | Post Reel thumbnails, infographics |
| Receive and read messages | Monitor community DMs and group chat |
| Pin messages | Highlight important community updates |
| Schedule broadcasts | Send content at optimal times |
| Get channel analytics | Member count, message views |

---

## Step-by-step setup

### Step 1 — Create your Telegram Bot (2 minutes)

1. Open Telegram and search for **@BotFather**
2. Start a chat and send: `/newbot`
3. BotFather will ask for a name — enter: `Matt AIOS Bot` (or your community name)
4. Then it asks for a username — must end in `bot`, e.g. `mattaios_bot`
5. BotFather sends you a **bot token** — looks like:
   ```
   7123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   **Copy and save this immediately.**

---

### Step 2 — Create your Telegram Channel or Group

**For broadcasting (one-way content):** Create a **Channel**
- Telegram app → hamburger menu → "New Channel"
- Name it e.g. "African Men 35+ Health & AI"
- Set to Public, choose a username like `@africanmen35`

**For community discussion (two-way):** Create a **Group**
- Telegram → "New Group" → add members
- Later upgrade to a Supergroup for more features

---

### Step 3 — Add your Bot as Admin

1. Go to your Channel/Group → Settings → Administrators
2. Search for your bot username (e.g. `@mattaios_bot`)
3. Add it as admin with permissions: **Post Messages, Edit Messages, Delete Messages**

---

### Step 4 — Get your Chat ID

Send any message to your channel/group, then paste this URL in your browser (replace with your token):

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

Look for `"chat": {"id": -1001234567890}` in the response — that negative number is your **Chat ID**.

Alternatively, add **@userinfobot** to your group — it will display the chat ID.

---

### Step 5 — Save credentials

Add to your `.env` file:
```
TELEGRAM_BOT_TOKEN=7123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_CHAT_ID=-1001234567890
```

---

### Step 6 — Test it

Run this in your terminal:

```python
# scripts/telegram_test.py
import requests, os
from dotenv import load_dotenv
load_dotenv()

token = os.getenv("TELEGRAM_BOT_TOKEN")
chat_id = os.getenv("TELEGRAM_CHAT_ID")

r = requests.post(
    f"https://api.telegram.org/bot{token}/sendMessage",
    json={"chat_id": chat_id, "text": "AIOS connected. Brothers, we're live. 💪"}
)
print(r.json())
```

If you see `"ok": true` — you're connected.

---

## scripts/telegram_api.py — Full API script

```python
import requests, os
from dotenv import load_dotenv
load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
BASE = f"https://api.telegram.org/bot{TOKEN}"


def send_message(text, chat_id=CHAT_ID, parse_mode="Markdown"):
    """Send a text message to the channel/group."""
    r = requests.post(f"{BASE}/sendMessage", json={
        "chat_id": chat_id,
        "text": text,
        "parse_mode": parse_mode
    })
    return r.json()


def send_photo(image_path_or_url, caption="", chat_id=CHAT_ID):
    """Send an image with optional caption."""
    if image_path_or_url.startswith("http"):
        r = requests.post(f"{BASE}/sendPhoto", json={
            "chat_id": chat_id,
            "photo": image_path_or_url,
            "caption": caption,
            "parse_mode": "Markdown"
        })
    else:
        with open(image_path_or_url, "rb") as f:
            r = requests.post(f"{BASE}/sendPhoto", data={
                "chat_id": chat_id,
                "caption": caption
            }, files={"photo": f})
    return r.json()


def pin_message(message_id, chat_id=CHAT_ID):
    """Pin a message in the channel/group."""
    r = requests.post(f"{BASE}/pinChatMessage", json={
        "chat_id": chat_id,
        "message_id": message_id
    })
    return r.json()


def get_member_count(chat_id=CHAT_ID):
    """Get total number of members in channel/group."""
    r = requests.get(f"{BASE}/getChatMemberCount", params={"chat_id": chat_id})
    return r.json()


def get_updates():
    """Get recent messages sent to the bot."""
    r = requests.get(f"{BASE}/getUpdates")
    return r.json()


# --- Example usage ---
if __name__ == "__main__":
    # Send a health tip
    send_message(
        "*HEALTH TIP FOR BROTHERS 35+* 💚\n\n"
        "High blood pressure is silent. Check your numbers this week.\n\n"
        "Target: under 130/80. That's the goal."
    )

    # Get member count
    count = get_member_count()
    print(f"Community size: {count}")
```

---

## Content workflow with Telegram

Once connected, your AIOS can:

1. **Repurpose posts** — take your Facebook caption, reformat for Telegram (no hashtags, shorter), send via script
2. **Broadcast health tips** — Claude drafts → script sends → community receives
3. **Weekly digest** — every Sunday, auto-send a summary of the week's health topics
4. **Community announcements** — new posts, live sessions, milestones

---

## Notes

- Telegram Bot API is **free with no rate limits** for personal/community use
- Bots cannot read messages in private channels unless added as admin
- For Reels: send the video file directly via `sendVideo` endpoint
- Token never expires unless you revoke it in BotFather — no 60-day refresh needed (unlike Meta)
- Add a calendar reminder to check `getUpdates` weekly for community messages
