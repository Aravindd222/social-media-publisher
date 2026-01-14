# Social Media Publisher

A demo-ready social media publishing platform that allows users to log in, connect their LinkedIn account via OAuth, create posts, and publish them from a single backend system.

This project focuses on **real backend engineering concepts** like authentication, OAuth, background jobs, and database design — not just basic CRUD APIs.

---

## Features

- User registration and login
- Secure authentication using JWT
- LinkedIn OAuth 2.0 integration
- Verified LinkedIn Page association
- Create and manage posts
- Optional post scheduling
- Media upload support
- Designed for background publishing using Celery

This project performs **real OAuth with LinkedIn** and stores real access tokens.

---

## Tech Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic (migrations)
- JWT Authentication
- LinkedIn OAuth 2.0
- Celery + Redis

### Frontend
- Swagger UI (demo)
- Intended to be connected to a React frontend

---

## Project Structure

