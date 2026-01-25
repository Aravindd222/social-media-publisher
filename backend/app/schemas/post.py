from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional

class PublishRequest(BaseModel):
    platform: str
    content: str
    media_url: Optional[str] = None
    scheduled_at: Optional[datetime] = None


class InstagramConnectRequest(BaseModel):
    access_token: str
    ig_user_id: str

class InstagramPostRequest(BaseModel):
    image_url: HttpUrl
    caption: str
