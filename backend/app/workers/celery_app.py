from celery import Celery
from datetime import datetime
from sqlalchemy.orm import Session

from app.config import settings
from app.database import SessionLocal
from app.models.post import Post
from app.models.social_account import SocialAccount
from app.services.publish_service import publish_to_linkedin

celery = Celery(
    "worker",
    broker=settings.REDIS_BROKER_URL,
    backend=settings.REDIS_BROKER_URL,
)

@celery.task
def publish_scheduled_post(post_id: int):
    db: Session = SessionLocal()

    try:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return

        account = db.query(SocialAccount).filter(
            SocialAccount.user_id == post.user_id,
            SocialAccount.platform == "linkedin"
        ).first()

        if not account:
            post.status = "FAILED"
            post.error_message = "LinkedIn account not connected"
            db.commit()
            return

        publish_to_linkedin(post.content, account.access_token)

        post.status = "PUBLISHED"
        post.published_at = datetime.utcnow()
        db.commit()

    except Exception as e:
        post.status = "FAILED"
        post.error_message = str(e)
        db.commit()

    finally:
        db.close()
