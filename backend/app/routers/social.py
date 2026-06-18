from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import RedirectResponse
from app.config import settings
import urllib.parse
from typing import Optional
from app.database import get_db
from app.models.social_account import SocialAccount
from app.routers.auth import get_current_user
from app.schemas.post import PublishRequest, InstagramConnectRequest,InstagramPublishRequest
from sqlalchemy.orm import Session
from app.services.publish_service import create_media_container,publish_media, wait_for_container, publish_linkedin_with_image
from app.services.oauth_service import (
    get_linkedin_auth_url,
    exchange_code_for_token,
    get_linkedin_profile_id,
)
from app.services.jwt_utils import decode_token
from datetime import datetime, timezone
from app.models.post import Post
from app.tasks.linkedin import publish_linkedin_task
from app.services.storage import save_image_and_get_url
from app.celery_app import celery_app

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
@router.get("/callback/linkedin")
def linkedin_callback(
    code: Optional[str] = None,
    state: Optional[str] = None,
    error: Optional[str] = None,
    error_description: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if error:
        return RedirectResponse(
            f"{settings.FRONTEND_URL}/settings?"
            f"error={error_description or error}",
            status_code=303
    )
    if not code:
        raise HTTPException(400, "Authorization code missing")
    
    user_id = decode_token(state)
    if not user_id:
        raise HTTPException(400, "Invalid state")
    try:
        token = exchange_code_for_token(code)
    except Exception:
        raise HTTPException(400, "LinkedIn token exchange failed")

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
    return RedirectResponse(f"{settings.FRONTEND_URL}/settings", status_code=303)

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
    content: str = Form(...),
    image: UploadFile | None = File(None),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    account = db.query(SocialAccount).filter(
        SocialAccount.user_id == user.id,
        SocialAccount.platform == "linkedin"
    ).first()

    if not account:
        raise HTTPException(400, "LinkedIn not connected")

    image_url = save_image_and_get_url(image) if image else None

    access_token = account.access_token
    linkedin_user_id = account.platform_user_id

    publish_linkedin_with_image(access_token, linkedin_user_id, content, image_url)

    return {"status": "published"}



@router.post("/schedule/linkedin")
def schedule_linkedin_post(
    content: str = Form(...),
    scheduled_at: datetime = Form(...),
    image: UploadFile | None = File(None),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    eta = scheduled_at.astimezone(timezone.utc)

    image_url = save_image_and_get_url(image) if image else None

    post = Post(
        user_id=user.id,
        platform="linkedin",
        content=content,
        media_url=image_url,
        scheduled_at=eta,
        status="scheduled",
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    task = publish_linkedin_task.apply_async(
        args=[post.id],
        eta=eta
    )

    post.celery_task_id = task.id

    db.commit()

    return {"status": "scheduled"}





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



from app.services.storage import save_image_and_get_url
from app.tasks.instagram import publish_instagram_task




@router.post("/publish/instagram")
def publish_instagram(
    caption: str = Form(...),
    image: UploadFile = File(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    account = db.query(SocialAccount).filter(
        SocialAccount.user_id == user.id,
        SocialAccount.platform == "instagram"
    ).first()

    if not account:
        raise HTTPException(status_code=400, detail="Instagram not connected")

    # 1️⃣ Upload to Cloudinary
    image_url = save_image_and_get_url(image)

    # 2️⃣ Create media container
    creation_id = create_media_container(
        access_token=account.access_token,
        ig_user_id=account.platform_user_id,
        image_url=image_url,
        caption=caption,
    )

    # 3️⃣ WAIT until Instagram finishes processing
    wait_for_container(account.access_token, creation_id)

    # 4️⃣ Publish
    publish_media(
        access_token=account.access_token,
        ig_user_id=account.platform_user_id,
        creation_id=creation_id,
    )

    return {"status": "published"}




@router.post("/schedule/instagram")
def schedule_instagram_post(
    caption: str = Form(...),
    scheduled_at: datetime = Form(...),
    image: UploadFile = File(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    account = db.query(SocialAccount).filter(
        SocialAccount.user_id == user.id,
        SocialAccount.platform == "instagram"
    ).first()

    if not account:
        raise HTTPException(status_code=400, detail="Instagram not connected")

    # 1️⃣ Store image in Cloudinary (same as immediate flow)
    image_url = save_image_and_get_url(image)

    eta = scheduled_at.astimezone(timezone.utc)

    # 2️⃣ Create DB record
    post = Post(
        user_id=user.id,
        platform="instagram",
        content=caption,
        media_url=image_url,
        scheduled_at=eta,
        status="scheduled",
        celery_task_id=None
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    # 3️⃣ Queue Celery task
    task = publish_instagram_task.apply_async(
        args=[post.id],
        eta=eta
    )

    post.celery_task_id = task.id

    db.commit()

    return {"status": "scheduled", "run_at": eta}

#update scheduled post with new content, time, or image
@router.put("/{post_id}")
def edit_scheduled_post(
    post_id: int,
    content: str = Form(...),
    scheduled_at: datetime = Form(...),
    image: UploadFile | None = File(None),   # ← NEW
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == user.id
    ).first()

    if not post:
        raise HTTPException(404, "Post not found")

    if post.status != "scheduled":
        raise HTTPException(400, "Only scheduled posts can be edited")

    # 1. revoke old celery task
    if post.celery_task_id:
        celery_app.control.revoke(post.celery_task_id)

    # 2. upload new image if provided
    if image:
        new_image_url = save_image_and_get_url(image)
        post.media_url = new_image_url

    # 3. update content and schedule
    eta = scheduled_at.astimezone(timezone.utc)

    post.content = content
    post.scheduled_at = eta
    post.status = "scheduled"

    # 4. reschedule celery task
    if post.platform == "linkedin":

        task = publish_linkedin_task.apply_async(
            args=[post.id],
            eta=eta
        )

    elif post.platform == "instagram":

        task = publish_instagram_task.apply_async(
            args=[post.id],
            eta=eta
        )

    else:
        raise HTTPException(400, "Unsupported platform")

    # 5. save new task id
    post.celery_task_id = task.id

    db.commit()

    return {
        "status": "rescheduled",
        "post_id": post.id,
        "new_media_url": post.media_url
    }



@router.delete("/account/{platform}")
def delete_social_account(
    platform: str,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    account = db.query(SocialAccount).filter(
        SocialAccount.user_id == user.id,
        SocialAccount.platform == platform
    ).first()

    if not account:
        raise HTTPException(404, f"{platform} account not found")

    db.delete(account)
    db.commit()

    return {"status": f"{platform} disconnected"}