# LinkedIn API — Setup Guide

**Status:** Not yet connected
**What it unlocks:** Publish posts to your LinkedIn profile, track post analytics.
**Priority:** HIGH — your professional reach platform

---

## What you'll be able to do once connected

| Action | Use case |
|---|---|
| Publish LinkedIn posts | Post without opening LinkedIn |
| Get post analytics | Track impressions, reactions, comments, shares |
| Read your profile | Confirm your URN (needed for posting) |

---

## Step-by-step setup

### Step 1 — Create a LinkedIn Developer App
1. Go to [linkedin.com/developers](https://www.linkedin.com/developers)
2. Log in with your LinkedIn account
3. Click "Create App"
4. Fill in: App name ("Matt AIOS"), your LinkedIn Page or profile, privacy policy URL (can be your future website)
5. Upload a logo (use any placeholder for now)

### Step 2 — Request API Products
Under your app's "Products" tab, request:
- **Share on LinkedIn** — for posting text content
- **Sign In with LinkedIn using OpenID Connect** — for profile access

### Step 3 — Get your Access Token
1. Go to the **OAuth 2.0 Tools** in your app
2. Generate a token with these scopes: `r_liteprofile`, `w_member_social`
3. Copy the token — this is your access token

### Step 4 — Get your LinkedIn URN
```python
# scripts/linkedin_test.py
import requests, os

token = os.getenv("LINKEDIN_ACCESS_TOKEN")
headers = {"Authorization": f"Bearer {token}", "X-Restli-Protocol-Version": "2.0.0"}

r = requests.get("https://api.linkedin.com/v2/me", headers=headers)
print(r.json())  # copy the "id" field — that's your URN
```

### Step 5 — Save credentials
Add to your `.env` file:
```
LINKEDIN_ACCESS_TOKEN=your_token_here
LINKEDIN_URN=urn:li:person:YOUR_ID_HERE
```

---

## Common API calls (save to scripts/)

```python
# Post to LinkedIn
def post_to_linkedin(text, urn, token):
    url = "https://api.linkedin.com/v2/ugcPosts"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    payload = {
        "author": urn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text},
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}
    }
    return requests.post(url, json=payload, headers=headers).json()
```

---

## Notes

- LinkedIn tokens expire — they're valid for 60 days by default
- The free LinkedIn API only supports text posts; image and video posts need additional review
- Save `scripts/linkedin_api.py` with your functions after setup
- LinkedIn's API rate limits are strict — don't post more than once per hour via script
