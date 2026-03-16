print("loading settings")

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    LINKEDIN_CLIENT_ID: Optional[str] = None
    LINKEDIN_CLIENT_SECRET: Optional[str] = None
    LINKEDIN_REDIRECT_URI: Optional[str] = None
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    REDIS_BROKER_URL: str

    class Config:
        env_file = ".env"
        extra = "forbid"

settings = Settings()
