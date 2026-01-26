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
    url = f"https://graph.facebook.com/v23.0/{ig_user_id}/media"

    params = {
        "image_url": image_url,
        "caption": caption,
        "access_token": access_token,
    }

    res = requests.post(url, params=params)
    print("CREATE:", res.status_code, res.text)
    res.raise_for_status()

    return res.json()["id"]

def wait_for_container(access_token: str, container_id: str):
    status_url = f"https://graph.facebook.com/v23.0/{container_id}"

    for _ in range(10):
        res = requests.get(
            status_url,
            params={
                "fields": "status_code",
                "access_token": access_token,
            },
        )
        res.raise_for_status()

        status = res.json().get("status_code")
        print("STATUS:", status)

        if status == "FINISHED":
            return

        if status in ("ERROR", "EXPIRED"):
            raise Exception(f"Container failed: {status}")

        time.sleep(3)

    raise TimeoutError("Container not ready")


def publish_media(access_token: str, ig_user_id: str, creation_id: str):
    url = f"https://graph.facebook.com/v23.0/{ig_user_id}/media_publish"

    res = requests.post(
        url,
        json={"creation_id": creation_id},
        headers={"Authorization": f"Bearer {access_token}"},
    )

    print("PUBLISH:", res.status_code, res.text)
    res.raise_for_status()

    return res.json()
