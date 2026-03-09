from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Index
from sqlalchemy.sql import func
from app.database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"),nullable= False)

    platform = Column(String, nullable=False)
    content = Column(String, nullable=False)
    media_url = Column(String, nullable=True)

    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    celery_task_id = Column(String, nullable=True)
    status = Column(String,nullable=False,default="pending")

    published_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(),nullable=False)

    __table_args__ = (
        Index("idx_posts_status", "status"),
        Index("idx_posts_scheduled_at", "scheduled_at"),
        Index("idx_posts_platform", "platform"),
    )