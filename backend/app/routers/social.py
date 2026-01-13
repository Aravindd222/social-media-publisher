from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from app.config import settings
import urllib.parse
from app.database import get_db
from app.models.social_account import SocialAccount
from app.routers.auth import get_current_user
import requests
from sqlalchemy.orm import Session
from app.services.oauth_service import (
    get_linkedin_auth_url,
    exchange_code_for_token,
    get_linkedin_profile_id,
)

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
def connect_linkedin(user=Depends(get_current_user)):
    return RedirectResponse(get_linkedin_auth_url(user.id))


@router.get("/callback/linkedin")
def linkedin_callback(code: str, state: str, db: Session = Depends(get_db)):
    user_id = int(state)   # THIS is the user
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
    return {"message": "LinkedIn connected"}
