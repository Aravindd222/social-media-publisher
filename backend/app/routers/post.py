from fastapi import APIRouter, Depends, File, UploadFile, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.post import Post
from app.schemas.post import PublishRequest
from app.services.media_service import save_media
from app.routers.auth import get_current_user
from app.celery_app import celery_app
from fastapi import HTTPException


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

    post.status = "Scheduled" if data.scheduled_at else "Published"
    db.add(post)
    db.commit()
    return {"message": "Post created", "post_id": post.id}

@router.delete("/{post_id}")
def cancel_scheduled_post(
    post_id: int,
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
        raise HTTPException(400, "Only scheduled posts can be cancelled")

    # revoke celery task
    if post.celery_task_id:
        celery_app.control.revoke(
            post.celery_task_id,
            terminate=False
        )

    post.status = "cancelled"

    db.commit()

    return {"status": "cancelled"}

@router.post("/upload")
def upload_media(
    file: UploadFile = File(...),
    user = Depends(get_current_user)
):
    url = save_media(file)
    return {"media_url": url}


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    base_query = db.query(Post).filter(Post.user_id == user.id)

    total = base_query.count()

    scheduled = base_query.filter(Post.status == "scheduled").count()
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

@router.get("/me")
def get_my_posts(
    status: str | None = Query(None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    query = db.query(Post).filter(Post.user_id == user.id)

    if status:
        query = query.filter(Post.status == status)

    posts = query.order_by(Post.created_at.desc()).all()

    return posts

@router.get("/{post_id}")
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == user.id
    ).first()

    if not post:
        raise HTTPException(404, "Post not found")

    return {
        "id": post.id,
        "content": post.content,
        "media_url": post.media_url,
        "scheduled_at": post.scheduled_at,
        "platform": post.platform,
        "status": post.status
    }

@router.get("/")
def list_all_posts(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return (
        db.query(Post)
        .filter(Post.user_id == user.id)
        .order_by(Post.created_at.desc())
        .all()
    )
