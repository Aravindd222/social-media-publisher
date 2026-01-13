from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.post import Post
from app.schemas.post import PostCreate
from app.services.media_service import save_media
from app.routers.auth import get_current_user

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/")
def create_post(
    data: PostCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    post = Post(
        user_id=user.id,
        content=data.content,
        scheduled_at=data.scheduled_at,
        media_url=data.media_url
    )

    post.status = "Scheduled" if data.scheduled_at else "Publish now"
    db.add(post)
    db.commit()
    return {"message": "Post created", "post_id": post.id}


@router.post("/upload")
def upload_media(
    file: UploadFile = File(...),
    user = Depends(get_current_user)
):
    url = save_media(file)
    return {"media_url": url}



