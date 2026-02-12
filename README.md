# Social Media Publisher

A production-style, full-stack Social Media Management Platform that enables users to connect social accounts, publish content instantly, and schedule posts using a distributed task queue system.

This project demonstrates real-world backend architecture using FastAPI, Celery, Redis, OAuth 2.0, and JWT authentication, combined with a modern React dashboard.

---

## **1. Environment Setup**

### **Create and Activate Virtual Environment (Windows)**

```bash
python -m venv myvenv
myvenv\Scripts\Activate.ps1
```

### **Install Backend Dependencies**

```bash
pip install -r requirements.txt
```

---

## **2. Running the Application**

### **Start Backend Server**

```bash
myvenv\Scripts\Activate.ps1
cd backend
uvicorn app.main:app --reload
```

### **Start Frontend**

```bash
cd frontend
npm install
npm run dev
```

### **Start Celery Worker**

```bash
celery -A app.celery_app.celery_app worker -l info
```

Ensure Redis server is running before starting Celery.

---

## **3. LinkedIn OAuth Flow**

The application implements a secure OAuth 2.0 authorization flow.

### **Flow Steps**

1. User logs in and receives a JWT.  
2. User calls `/social/connect/linkedin`.  
3. Backend redirects user to LinkedIn authorization page.  
4. User logs in and approves access.  
5. LinkedIn redirects back to:

```
/social/callback/linkedin
```

6. Backend exchanges authorization code for an access token.  
7. LinkedIn profile ID and access token are stored in the database.  
8. Verified LinkedIn App and Company Page allow publishing.  
9. User can now publish or schedule posts using stored credentials.  

---

## **4. Core Features**

### **Authentication System**

- User registration and login  
- JWT-based authentication  
- Password hashing with bcrypt  
- Protected API routes  

### **LinkedIn Integration**

- OAuth 2.0 authorization flow  
- Secure token storage  
- Immediate publishing  
- Scheduled publishing via Celery  

### **Instagram Integration**

Users connect using:

- `ig_user_id`  
- `access_token`  

Features include:

- Credential storage in database  
- Immediate publishing  
- Scheduled publishing via background tasks  

### **Post Scheduling System**

#### **Endpoint**

```
/social/schedule/{platform}
```

#### **Request Payload**

- `content`  
- `media_url`  
- `scheduled_at` (ISO 8601 format)  

#### **Execution Flow**

1. API validates request.  
2. Task queued via Celery.  
3. Redis acts as message broker.  
4. Worker executes publish task at scheduled time.  
5. Post is automatically published.  

---

## **5. Dashboard UI**

Built using Material Tailwind Dashboard template.

Includes:

- Responsive layout  
- Connected account status indicators  
- Conditional UI rendering  
- Publishing forms  
- Datetime-based scheduling input  

---

## **6. Backend Architecture**

### **Framework**
FastAPI  

### **Background Processing**
Celery (task queue)  
Redis (message broker)  

### **Database**
PostgreSQL or SQLite (environment-based configuration)  

### **Security**
JWT Authentication  
OAuth 2.0 (LinkedIn)  

---

## **7. Frontend Stack**

- React (Vite)  
- Material Tailwind  
- Tailwind CSS  
- React Router v6  
- Axios  

---

## **8. High-Level System Flow**

```
User → Login → Dashboard
      → Connect Social Account
      → Create Post
      → Choose:

          Publish Now
          → Direct API Call
          → Platform API
          → Post Published

          Schedule Post
          → Celery Task Queued
          → Redis Broker
          → Worker Executes at Scheduled Time
          → Post Published
```

---

## **9. Technology Stack**

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| UI Framework | Material Tailwind |
| Styling | Tailwind CSS |
| Backend | FastAPI |
| Task Queue | Celery |
| Broker | Redis |
| Authentication | JWT + OAuth 2.0 |
| Database | PostgreSQL / SQLite |

---

## **10. System Design Highlights**

- Decoupled frontend and backend  
- Non-blocking API using background workers  
- OAuth-based third-party integration  
- Distributed task execution  
- Clean REST API structure  
- Scalable architecture pattern  

---

## **11. Future Improvements**

- LinkedIn refresh token handling  
- Webhook-based publishing confirmations  
- Media storage integration (AWS S3)  
- Analytics dashboard  
- Dockerized deployment  
- CI/CD pipeline  

---

## **12. Author**

Developed as a full-stack distributed system to simulate real-world SaaS publishing workflows and demonstrate production-grade backend architecture.
