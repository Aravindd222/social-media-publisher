from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.post import Post
from app.schemas.post import PostCreate
from app.services.media_service import save_media

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.post("/")
def create_post(data:PostCreate, db: Session = Depends(get_db)):
    post = Post(**data.dict())
    post.status = "Scheduled" if data.scheduled_at else "Publish now"
    db.add(post)
    db.commit()
    return {"message": "Post created", "post_id": post.id}

@router.post("/upload")
def upload_media(file: UploadFile = File(...)):
    url = save_media(file)
    return{"media_url" : url}


