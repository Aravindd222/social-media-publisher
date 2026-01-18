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


---

## Authentication Flow

1. User registers with email and password
2. Passwords are hashed using bcrypt
3. User logs in and receives a JWT access token
4. Protected routes require:
        Authorization: Bearer <token>

---

## LinkedIn OAuth Flow

1. User logs in and gets a JWT
2. User calls `/social/connect/linkedin`
3. Backend redirects to LinkedIn authorization page
4. User approves access
5. LinkedIn redirects back to:
        /social/callback/linkedin
6. Backend exchanges the code for an access token
7. LinkedIn profile ID and token are stored in the database

The LinkedIn app and company page are verified to allow publishing.

---

## Environment Variables












