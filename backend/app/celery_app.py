from celery import Celery
from app.config import settings

celery_app = Celery(
    "social_publisher",
    broker=settings.REDIS_BROKER_URL,
    backend=settings.REDIS_BROKER_URL,
    include=['app.tasks.instagram','app.tasks.linkedin']
)

celery_app.autodiscover_tasks(["app.tasks"])

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)
