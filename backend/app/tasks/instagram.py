from app.celery_app import celery_app
from app.database import SessionLocal
from app.models.post import Post
from app.models.social_account import SocialAccount
from app.services.publish_service import (
    create_media_container,
    wait_for_container,
    publish_media,
)


@celery_app.task(name='app.tasks.instagram.publish_instagram_task', bind=True, max_retries=3)
def publish_instagram_task(self, post_id: int):
    db = SessionLocal()

    try:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise Exception("Post not found")
        
        if post.status == "published":
            return 
               
        account = db.query(SocialAccount).filter(
            SocialAccount.user_id == post.user_id,
            SocialAccount.platform == "instagram"
        ).first()

        if not account:
            raise Exception("Instagram not connected")

        creation_id = create_media_container(
            access_token=account.access_token,
            ig_user_id=account.platform_user_id,
            image_url=post.media_url,
            caption=post.content,
        )

        wait_for_container(account.access_token, creation_id)

        publish_media(
            access_token=account.access_token,
            ig_user_id=account.platform_user_id,
            creation_id=creation_id,
        )

        post.status = "published"
        db.commit()

    except Exception as e:
        db.rollback()
        post.status = "failed"
        db.commit()
        raise self.retry(exc=e, countdown=60)

    finally:
        db.close()
