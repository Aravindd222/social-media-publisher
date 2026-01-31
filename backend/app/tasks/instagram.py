from app.celery_app import celery_app
from app.database import SessionLocal
from app.models.post import Post
from app.models.social_account import SocialAccount
from app.services.publish_service import (
    create_media_container,
    wait_for_container,
    publish_media,
)

@celery_app.task(bind=True, max_retries=3)
def publish_instagram_task(self, post_id: int):
    db = SessionLocal()

    try:
        account = db.query(SocialAccount).filter(
            SocialAccount.user_id == post.user_id,
            SocialAccount.platform == "instagram"
        ).first()

        if not account:
            raise Exception("Instagram not connected")

        creation_id = create_media_container(
            access_token=account.access_token,
            ig_user_id=account.platform_user_id,
            image_url=post.image_url,
            caption=post.caption,
        )

        wait_for_container(account.access_token, creation_id)

        publish_media(
            access_token=account.access_token,
            ig_user_id=account.platform_user_id,
            creation_id=creation_id,
        )

    except Exception as e:
        post.status = "failed"
        db.commit()
        raise self.retry(exc=e, countdown=60)

    finally:
        db.close()
