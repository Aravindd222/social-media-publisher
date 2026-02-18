from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.post import Post
from app.schemas.post import PublishRequest
from app.services.media_service import save_media
from app.routers.auth import get_current_user

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/")
def create_post(
    data: PublishRequest,
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



@router.get("/me")
def get_my_posts(db: Session = Depends(get_db), user=Depends(get_current_user)):
    posts = (
        db.query(Post)
        .filter(Post.user_id == user.id)
        .order_by(Post.created_at.desc())
        .all()
    )

    return posts


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    base_query = db.query(Post).filter(Post.user_id == user.id)

    total = base_query.count()

    scheduled = base_query.filter(Post.status == "pending").count()
    published = base_query.filter(Post.status == "published").count()
    failed = base_query.filter(Post.status == "failed").count()

    recent = (
        base_query
        .order_by(Post.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total": total,
        "scheduled": scheduled,
        "published": published,
        "failed": failed,
        "recent": recent
    }