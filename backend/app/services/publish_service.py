import requests
import time

def download_image_as_bytes(url: str) -> bytes:
    res = requests.get(url)
    res.raise_for_status()
    return res.content

def post_to_linkedin(token: str, linkedin_user_id: str, text: str,asset=None):
    url = "https://api.linkedin.com/v2/ugcPosts"

    headers = {
        "Authorization": f"Bearer {token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }

    media_part = []
    category = "NONE"

    if asset:
        category = "IMAGE"
        media_part = [
            {
                "status": "READY",
                "media": asset,
                "title": {"text": "Image"}
            }
        ]

    payload = {
        "author": f"urn:li:person:{linkedin_user_id}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
            "shareCommentary": {
                "text": text},
                "shareMediaCategory": category,
                "media": media_part
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

def register_image_upload(token: str, linkedin_user_id: str):
    url = "https://api.linkedin.com/v2/assets?action=registerUpload"

    headers = {
        "Authorization": f"Bearer {token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
    }

    payload = {
        "registerUploadRequest": {
            "owner": f"urn:li:person:{linkedin_user_id}",
            "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
            "serviceRelationships": [
                {
                    "relationshipType": "OWNER",
                    "identifier": "urn:li:userGeneratedContent"
                }
            ],
        }
    }

    res = requests.post(url, json=payload, headers=headers)
    res.raise_for_status()

    data = res.json()

    upload_url = data["value"]["uploadMechanism"][
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ]["uploadUrl"]

    asset = data["value"]["asset"]

    return upload_url, asset

def upload_image_to_linkedin(upload_url: str, image_bytes: bytes):
    headers = {"Content-Type": "application/octet-stream"}

    res = requests.put(upload_url, data=image_bytes, headers=headers)
    res.raise_for_status()


def publish_linkedin_with_image(token, linkedin_user_id, text, image_url=None):
    asset = None

    if image_url:
        image_bytes = download_image_as_bytes(image_url)
        upload_url, asset = register_image_upload(token, linkedin_user_id)
        upload_image_to_linkedin(upload_url, image_bytes)

    return post_to_linkedin(token, linkedin_user_id, text, asset)



#instagram publish flow:

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
        params={"creation_id": creation_id, "access_token": access_token,
            }
        )

    print("PUBLISH:", res.status_code, res.text)
    res.raise_for_status()

    return res.json()
