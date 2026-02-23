from app.celery_app import celery_app
from app.database import SessionLocal
from app.models.post import Post
from app.models.social_account import SocialAccount
from app.services.publish_service import publish_linkedin_with_image
from datetime import datetime


@celery_app.task(name="app.tasks.linkedin.publish_linkedin_task", bind=True, max_retries=3)
def publish_linkedin_task(self, post_id: int):
    db = SessionLocal()

    try:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise Exception("Post not found")

        if post.status == "published":
            return

        account = db.query(SocialAccount).filter(
            SocialAccount.user_id == post.user_id,
            SocialAccount.platform == "linkedin"
        ).first()

        if not account:
            raise Exception("LinkedIn not connected")

        publish_linkedin_with_image(
            token=account.access_token,
            linkedin_user_id=account.platform_user_id,
            text=post.content,
            image_url=post.media_url
        )

        post.status = "published"
        post.published_at = datetime.utcnow()
        db.commit()

    except Exception as e:
        db.rollback()
        post.status = "failed"
        post.error_message = str(e)
        db.commit()
        raise self.retry(exc=e, countdown=60)

    finally:
        db.close()
