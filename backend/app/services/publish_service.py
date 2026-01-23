import requests

def publish_to_linkedin(text, access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }

    profile = requests.get(
        "https://api.linkedin.com/v2/me",
        headers=headers
    ).json()

    urn = f"urn:li:person:{profile['id']}"

    payload = {
        "author": urn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text},
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }

    r = requests.post("https://api.linkedin.com/v2/ugcPosts", json=payload, headers=headers)
    return r.json()

def post_to_linkedin(token: str, linkedin_id: str, text: str):
    url = "https://api.linkedin.com/v2/ugcPosts"

    headers = {
        "Authorization": f"Bearer {token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }

    payload = {
        "author": "urn:li:person:{linkedin_user_id}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
            "shareCommentary": {
                "text": "Hello from my app"
            },
            "shareMediaCategory": "NONE"
        }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
  }
}


    res = requests.post(url, json=payload, headers=headers)
    if res.status_code >= 400:
        print("LinkedIn error:", res.text)
        res.raise_for_status()

    return res.json()


def create_media_container(access_token: str, ig_user_id: str, image_url: str, caption: str):
    url = f"https://graph.facebook.com/v19.0/{ig_user_id}/media"

    payload = {
        "image_url": image_url,
        "caption": caption,
        "access_token": access_token,
    }

    res = requests.post(url, data=payload)
    res.raise_for_status()
    return res.json()["id"]  # creation_id


def publish_media(access_token: str, ig_user_id: str, creation_id: str):
    url = f"https://graph.facebook.com/v19.0/{ig_user_id}/media_publish"

    payload = {
        "creation_id": creation_id,
        "access_token": access_token,
    }

    res = requests.post(url, data=payload)
    res.raise_for_status()
    return res.json()
