from fastapi import FastAPI
from app.routers import auth, post, social

app = FastAPI(title="Social Media Publisher Demo")

app.include_router(auth.router)
app.include_router(post.router)
app.include_router(social.router)

@app.get("/")
def health_check():
    return {"status": "ok"}

