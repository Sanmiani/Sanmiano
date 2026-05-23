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


def send_video(video_path_or_url, caption="", chat_id=CHAT_ID):
    """Send a video (Reel) with optional caption."""
    if video_path_or_url.startswith("http"):
        r = requests.post(f"{BASE}/sendVideo", json={
            "chat_id": chat_id,
            "video": video_path_or_url,
            "caption": caption,
            "parse_mode": "Markdown"
        })
    else:
        with open(video_path_or_url, "rb") as f:
            r = requests.post(f"{BASE}/sendVideo", data={
                "chat_id": chat_id,
                "caption": caption
            }, files={"video": f})
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


if __name__ == "__main__":
    count = get_member_count()
    print(f"Community size: {count}")
