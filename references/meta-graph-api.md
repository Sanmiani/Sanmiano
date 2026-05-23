# Meta Graph API — Setup Guide

**Status:** Not yet connected
**What it unlocks:** Publish posts to Instagram and Facebook Page, pull analytics, manage comments.
**Priority:** HIGH — your two biggest platforms

---

## What you'll be able to do once connected

| Action | Use case |
|---|---|
| Publish Instagram posts + Reels | Schedule and post without opening the app |
| Publish Facebook Page posts | Automate page posting |
| Pull post analytics | Track reach, likes, comments, saves per post |
| Read comments | Monitor community engagement |
| Get audience insights | Understand who's following you |

---

## Step-by-step setup

### Step 1 — Create a Meta Developer Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Log in with your Facebook account (mattsanmiano@gmail.com)
3. Click "Get Started" → create a developer account

### Step 2 — Create an App
1. Click "Create App"
2. Choose **"Business"** as the app type
3. Name it something like "Matt AIOS" — this is just your internal tool
4. Connect it to your Facebook Page

### Step 3 — Add Products
Add these two products to your app:
- **Instagram Graph API** — for Instagram posting and analytics
- **Facebook Pages API** — for Facebook Page posting

### Step 4 — Get your tokens
1. Go to **Graph API Explorer** (tools.developer.facebook.com)
2. Select your app
3. Generate a **Page Access Token** (long-lived, 60 days)
4. Add `instagram_basic`, `instagram_content_publish`, `pages_manage_posts`, `pages_read_engagement` permissions

### Step 5 — Save credentials
Create a `.env` file in your project root (already in `.gitignore`):
```
META_PAGE_ID=your_facebook_page_id
META_PAGE_ACCESS_TOKEN=your_long_lived_token
INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id
```

### Step 6 — Test it
```python
# scripts/meta_test.py
import requests, os

token = os.getenv("META_PAGE_ACCESS_TOKEN")
page_id = os.getenv("META_PAGE_ID")

r = requests.get(f"https://graph.facebook.com/{page_id}?fields=name,fan_count&access_token={token}")
print(r.json())
```

Run: `python scripts/meta_test.py` — if you see your page name and follower count, you're connected.

---

## Common API calls (save to scripts/)

```python
# Post to Facebook Page
def post_to_facebook(message, page_id, token):
    url = f"https://graph.facebook.com/{page_id}/feed"
    payload = {"message": message, "access_token": token}
    return requests.post(url, data=payload).json()

# Get page insights
def get_page_insights(page_id, token):
    url = f"https://graph.facebook.com/{page_id}/insights"
    params = {"metric": "page_impressions,page_engaged_users", "access_token": token}
    return requests.get(url, params=params).json()
```

---

## Notes

- Instagram must be a **Professional account** (Creator or Business) connected to your Facebook Page
- Reels publishing via API requires your app to be approved for `instagram_content_publish`
- Token expires every 60 days — set a calendar reminder to refresh it
- Save `scripts/meta_api.py` with your common functions after testing
