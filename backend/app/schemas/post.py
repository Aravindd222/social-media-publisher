from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PostCreate(BaseModel):
    platform: str
    content: str
    media_url: Optional[str] = None
    scheduled_at: Optional[datetime] = None

