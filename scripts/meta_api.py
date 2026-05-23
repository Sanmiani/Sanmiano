"""
Meta Graph API — Facebook Page + Instagram automation for Strong After 35
Run: python scripts/meta_api.py
"""

import os
import requests

# ── Credentials (load from .env or set directly) ──────────────────────────────
PAGE_ID            = os.getenv("META_PAGE_ID", "")
PAGE_ACCESS_TOKEN  = os.getenv("META_PAGE_ACCESS_TOKEN", "")
INSTAGRAM_ACCT_ID  = os.getenv("INSTAGRAM_ACCOUNT_ID", "")
BASE               = "https://graph.facebook.com/v21.0"


# ── Facebook Page ─────────────────────────────────────────────────────────────

def test_connection():
    """Verify credentials and print page info."""
    r = requests.get(
        f"{BASE}/{PAGE_ID}",
        params={"fields": "name,fan_count,followers_count", "access_token": PAGE_ACCESS_TOKEN}
    )
    data = r.json()
    if "error" in data:
        print(f"❌ Connection failed: {data['error']['message']}")
    else:
        print(f"✅ Connected to: {data.get('name')}")
        print(f"   Followers : {data.get('followers_count', 'N/A')}")
        print(f"   Fans      : {data.get('fan_count', 'N/A')}")
    return data


def post_to_facebook(message: str, link: str = None):
    """Post a text update (with optional link) to your Facebook Page."""
    url = f"{BASE}/{PAGE_ID}/feed"
    payload = {"message": message, "access_token": PAGE_ACCESS_TOKEN}
    if link:
        payload["link"] = link
    r = requests.post(url, data=payload)
    data = r.json()
    if "id" in data:
        print(f"✅ Facebook post published: {data['id']}")
    else:
        print(f"❌ Failed: {data}")
    return data


def post_image_to_facebook(message: str, image_url: str):
    """Post an image with caption to your Facebook Page."""
    url = f"{BASE}/{PAGE_ID}/photos"
    payload = {
        "message": message,
        "url": image_url,
        "access_token": PAGE_ACCESS_TOKEN
    }
    r = requests.post(url, data=payload)
    data = r.json()
    if "id" in data:
        print(f"✅ Facebook image post published: {data['id']}")
    else:
        print(f"❌ Failed: {data}")
    return data


def get_page_posts(limit: int = 10):
    """Get recent posts from your Facebook Page."""
    r = requests.get(
        f"{BASE}/{PAGE_ID}/posts",
        params={
            "fields": "message,created_time,likes.summary(true),comments.summary(true)",
            "limit": limit,
            "access_token": PAGE_ACCESS_TOKEN
        }
    )
    data = r.json()
    posts = data.get("data", [])
    print(f"\n📄 Last {len(posts)} Facebook posts:")
    for p in posts:
        msg = (p.get("message", "")[:80] + "...") if len(p.get("message", "")) > 80 else p.get("message", "")
        likes = p.get("likes", {}).get("summary", {}).get("total_count", 0)
        comments = p.get("comments", {}).get("summary", {}).get("total_count", 0)
        print(f"  [{p['created_time'][:10]}] 👍{likes} 💬{comments} — {msg}")
    return posts


def get_page_insights():
    """Pull engagement metrics from your Facebook Page."""
    r = requests.get(
        f"{BASE}/{PAGE_ID}/insights",
        params={
            "metric": "page_impressions,page_engaged_users,page_fans,page_post_engagements",
            "period": "week",
            "access_token": PAGE_ACCESS_TOKEN
        }
    )
    data = r.json()
    print("\n📊 Page Insights (weekly):")
    for item in data.get("data", []):
        print(f"  {item['name']}: {item['values'][-1]['value']}")
    return data


# ── Instagram ─────────────────────────────────────────────────────────────────

def post_to_instagram(image_url: str, caption: str):
    """
    Post an image to Instagram (2-step process).
    image_url must be publicly accessible (use Canva export, Google Drive share link, etc.)
    """
    # Step 1: Create media container
    r1 = requests.post(
        f"{BASE}/{INSTAGRAM_ACCT_ID}/media",
        data={
            "image_url": image_url,
            "caption": caption,
            "access_token": PAGE_ACCESS_TOKEN
        }
    )
    container = r1.json()
    if "id" not in container:
        print(f"❌ Container creation failed: {container}")
        return container

    container_id = container["id"]
    print(f"   Container created: {container_id}")

    # Step 2: Publish
    r2 = requests.post(
        f"{BASE}/{INSTAGRAM_ACCT_ID}/media_publish",
        data={"creation_id": container_id, "access_token": PAGE_ACCESS_TOKEN}
    )
    data = r2.json()
    if "id" in data:
        print(f"✅ Instagram post published: {data['id']}")
    else:
        print(f"❌ Publish failed: {data}")
    return data


def get_instagram_insights(media_id: str):
    """Get insights for a specific Instagram post."""
    r = requests.get(
        f"{BASE}/{media_id}/insights",
        params={
            "metric": "impressions,reach,likes,comments,saves,shares",
            "access_token": PAGE_ACCESS_TOKEN
        }
    )
    data = r.json()
    print(f"\n📊 Instagram insights for {media_id}:")
    for item in data.get("data", []):
        print(f"  {item['name']}: {item['values'][0]['value']}")
    return data


def get_instagram_recent_posts(limit: int = 10):
    """Get recent Instagram posts with basic stats."""
    r = requests.get(
        f"{BASE}/{INSTAGRAM_ACCT_ID}/media",
        params={
            "fields": "id,caption,like_count,comments_count,timestamp,permalink",
            "limit": limit,
            "access_token": PAGE_ACCESS_TOKEN
        }
    )
    data = r.json()
    posts = data.get("data", [])
    print(f"\n📸 Last {len(posts)} Instagram posts:")
    for p in posts:
        caption = (p.get("caption", "")[:70] + "...") if len(p.get("caption", "")) > 70 else p.get("caption", "")
        print(f"  [{p['timestamp'][:10]}] 👍{p.get('like_count',0)} 💬{p.get('comments_count',0)} — {caption}")
    return posts


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 50)
    print("Meta Graph API — Strong After 35")
    print("=" * 50)

    if not PAGE_ACCESS_TOKEN or not PAGE_ID:
        print("\n⚠️  Credentials not set.")
        print("Add these to your .env file:")
        print("  META_PAGE_ID=your_page_id")
        print("  META_PAGE_ACCESS_TOKEN=your_token")
        print("  INSTAGRAM_ACCOUNT_ID=your_instagram_id")
        print("\nSee references/meta-graph-api.md for setup steps.")
    else:
        test_connection()
