from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from app.config import settings
import urllib.parse
from app.database import get_db
from app.models.social_account import SocialAccount
from app.routers.auth import get_current_user
from app.schemas.post import PublishRequest, InstagramConnectRequest,InstagramPublishRequest
import requests
from sqlalchemy.orm import Session
from app.services.publish_service import post_to_linkedin, create_media_container,publish_media, wait_for_container
from app.services.oauth_service import (
    get_linkedin_auth_url,
    exchange_code_for_token,
    get_linkedin_profile_id,
)
from app.services.jwt_utils import decode_token
import time
router = APIRouter(prefix="/social", tags=["Social"])
'''
@router.get("/connect/{platform}")
def connect_social(platform : str):
    return {"message": f"Redirect user to {platform} OAuth"}

@router.get("/callback/{platform}")
def oauth_callback(platform: str):
    return {"message": f"{platform} connected"}
'''

@router.get("/connect/linkedin")
def connect_linkedin(token: str):
    """
    token = JWT token sent from frontend
    """
    auth_url = get_linkedin_auth_url(token)
    return RedirectResponse(auth_url)


@router.get("/callback/linkedin")
def linkedin_callback(code: str, state: str, db: Session = Depends(get_db)):
    user_id = decode_token(state)
    token = exchange_code_for_token(code)

    linkedin_id = get_linkedin_profile_id(token)

    account = db.query(SocialAccount).filter(
        SocialAccount.user_id == user_id,
        SocialAccount.platform == "linkedin"
    ).first()

    if not account:
        account = SocialAccount(
            user_id=user_id,
            platform="linkedin",
            access_token=token,
            platform_user_id=linkedin_id
        )
        db.add(account)
    else:
        account.access_token = token
        account.platform_user_id = linkedin_id

    db.commit()
    return RedirectResponse("http://localhost:5173/dashboard")

@router.get("/status")
def social_status(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    linkedin_account = db.query(SocialAccount).filter(
        SocialAccount.user_id == user.id,
        SocialAccount.platform == "linkedin"
    ).first()

    instagram_account = db.query(SocialAccount).filter(
        SocialAccount.user_id == user.id,
        SocialAccount.platform == "instagram"
    ).first()
    return {
        "linkedin_connected": bool(linkedin_account),
        "instagram_connected": bool(instagram_account),
    }

@router.post("/publish")
def publish_post(
    data: PublishRequest,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    account = db.query(SocialAccount).filter(
        SocialAccount.user_id == user.id,
        SocialAccount.platform == "linkedin"
    ).first()

    if not account:
        raise HTTPException(400, "LinkedIn not connected")

    access_token = account.access_token
    linkedin_user_id = account.platform_user_id

    post_to_linkedin(access_token, linkedin_user_id, data.content)

    return {"status": "published"}



#INSTAGRAM





@router.post("/connect/instagram")
def connect_instagram(
    data: InstagramConnectRequest,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    account = db.query(SocialAccount).filter(SocialAccount.user_id == user.id, SocialAccount.platform == "instagram").first()

    if account:
        account.access_token = data.access_token
        account.platform_user_id = data.ig_user_id

    else:
        account = SocialAccount(
            user_id = user.id,
            platform = "instagram",
            access_token = data.access_token,
            platform_user_id = data.ig_user_id
        )
        db.add(account)

    db.commit()
    return {"status":"instagram connected"}

from app.services.publish_service import (
    create_media_container,
    publish_media,
)
@router.post("/publish/instagram")
def publish_instagram(
    data: InstagramPublishRequest,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    account = db.query(SocialAccount).filter(
        SocialAccount.user_id == user.id,
        SocialAccount.platform == "instagram"
    ).first()

    if not account:
        raise HTTPException(400, "Instagram not connected")

    container_id = create_media_container(
        account.access_token,
        account.platform_user_id,
        str(data.image_url),
        data.caption,
    )

    wait_for_container(account.access_token, container_id)

    publish_media(
        account.access_token,
        account.platform_user_id,
        container_id,
    )

    return {"status": "published"}

