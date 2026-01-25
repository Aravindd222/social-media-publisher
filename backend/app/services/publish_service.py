import requests
import time


def post_to_linkedin(token: str, linkedin_user_id: str, text: str):
    url = "https://api.linkedin.com/v2/ugcPosts"

    headers = {
        "Authorization": f"Bearer {token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }

    payload = {
        "author": f"urn:li:person:{linkedin_user_id}",
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
    media_url = f"https://graph.facebook.com/v19.0/{ig_user_id}/media"

    payload = {
        "image_url": str(image_url),
        "caption": caption,
        "access_token": access_token,
    }

    res = requests.post(media_url, data=payload)
    print("Instagram API Response:", res.status_code, res.text)
    if res.status_code >= 400:
        return {"error": res.json()}
    res.raise_for_status()
    return res.json()["id"]  # creation_id



def publish_media(access_token: str, ig_user_id: str, creation_id: str):
    time.sleep(5)
    publish_url = f"https://graph.facebook.com/v19.0/{ig_user_id}/media_publish"

    payload = {
        "creation_id": creation_id,
        "access_token": access_token,
    }

    res = requests.post(publish_url, data=payload)
    print("Instagram publish:", res.status_code,res.text)
    res.raise_for_status()
    
    return res.json()
