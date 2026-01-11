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
)

router = APIRouter(prefix="/social", tags=["Social"])

@router.get("/connect/{platform}")
def connect_social(platform : str):
    return {"message": f"Redirect user to {platform} OAuth"}

@router.get("/callback/{platform}")
def oauth_callback(platform: str):
    return {"message": f"{platform} connected"}

@router.get("/connect/linkedin")
def connect_linkedin():
    return RedirectResponse(get_linkedin_auth_url())


@router.get("/callback/linkedin")
def linkedin_callback(code: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    token = exchange_code_for_token(code)

    account = db.query(SocialAccount).filter(
        SocialAccount.user_id == user.id,
        SocialAccount.platform == "linkedin"
    ).first()

    if account:
        account.access_token = token
    else:
        account = SocialAccount(
            user_id=user.id,
            platform="linkedin",
            access_token=token
        )
        db.add(account)

    db.commit()
    return {"message": "LinkedIn connected successfully"}