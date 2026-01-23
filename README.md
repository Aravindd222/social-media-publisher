

# 1️⃣ Create & Activate Virtual Environment
* cmd - python -m venv myvenv
* cmd - myvenv\Scripts\Activate.ps1

# 2️⃣ Install Dependencies
* cmd - pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary \
python-jose passlib[bcrypt] python-dotenv requests python-multipart urllib.parse  

2. myvenv file

3.Activate env file,cd backend and execute uvicorn app.main:app --reload

4.Activate env file,cd frontend and execute npm run dev

5.**LinkedIn OAuth Flow**
1. User logs in and gets a JWT
2. User calls `/social/connect/linkedin`
3. Backend redirects to LinkedIn authorization page and user login with login details.
4. User approves access
5. LinkedIn redirects back to:
        /social/callback/linkedin
6. Backend exchanges the code for an access token
7. LinkedIn profile ID and token are stored in the database

The LinkedIn app and company page are verified to allow publishing.
8.Then user create post with path consist of token from linkedin and User can now publish or schedule posts via this platform.












