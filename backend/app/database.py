from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings



DATABASE_URL = "postgresql://postgres:postgre123@localhost:5432/social_publisher_db"

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit = False, autoflush=False, bind=engine) 
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

