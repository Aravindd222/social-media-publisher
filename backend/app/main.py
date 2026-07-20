from fastapi import FastAPI
from app.routers import auth, post, social
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Social Media Publisher Demo")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://social-frontend-q0te.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router) 

app.include_router(post.router)

app.include_router(social.router)

@app.get("/")
def health_check():
    return {"status": "ok"}

