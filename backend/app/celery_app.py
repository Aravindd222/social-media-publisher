from celery import Celery

celery_app = Celery(
    "social_publisher",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
    include=['app.tasks.instagram','app.tasks.linkedin']
)

celery_app.autodiscover_tasks(["app.tasks"])

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)
