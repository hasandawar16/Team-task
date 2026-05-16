# Team Task Manager

A full-stack collaborative task management application built with React, Node.js, Express, and Prisma (SQLite/PostgreSQL).

## Features
- **User Authentication:** Secure JWT-based signup and login.
- **Project Management:** Create projects, add members (Admin/Member roles).
- **Task Tracking:** Create tasks, assign priorities (Low/Medium/High), and track status (To Do, In Progress, Done).
- **Dashboard:** Overview of tasks, statuses, and overdue items.
- **Premium Design:** Glassmorphism UI, dark mode aesthetics, responsive layout.

## Local Setup Instructions

### Prerequisites
- Node.js installed
- Git installed

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. The local database uses SQLite by default. Run migrations to generate the database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or similar). Open it in your browser!

---

## Deployment to Railway (Step-by-Step)

To deploy this application to Railway, we will deploy the backend and frontend as two separate services from the same GitHub repository.

### 1. Push to GitHub
1. Initialize git in the root folder: `git init`
2. Create a `.gitignore` file in the root:
   ```
   node_modules/
   .env
   dev.db
   dist/
   ```
3. Commit and push your code to a new public GitHub repository.

### 2. Deploy Backend on Railway
1. Go to [Railway.app](https://railway.app/) and create a new project.
2. Select **"Deploy from GitHub repo"** and choose your repository.
3. In the Railway dashboard for this service, go to **Settings > General**:
   - Set **Root Directory** to `/backend`.
4. Go to **Settings > Deploy**:
   - Set the **Start Command** to `npm start`.
5. Go to **Variables** and add:
   - `JWT_SECRET`: `your_super_secret_jwt_key`
   - `PORT`: `5000`
   - `DATABASE_URL`: `file:./dev.db` *(Note: For a production database, you can add a PostgreSQL service in Railway, change the provider in `schema.prisma` from `sqlite` to `postgresql`, and put the Postgres URL here. But SQLite with a persistent volume also works for the assignment).*
6. Railway will automatically build and deploy your backend.
7. Go to **Settings > Networking** and **Generate Domain**. Save this URL!

### 3. Deploy Frontend on Railway
1. In the same Railway project, click **New** -> **GitHub Repo** and select the same repository again.
2. In the new service settings, go to **Settings > General**:
   - Set **Root Directory** to `/frontend`.
3. Before deploying, you need to connect the frontend to the live backend URL.
   - Go to `frontend/src/api.js` and change `http://localhost:5000/api` to your live Railway Backend Domain (e.g., `https://your-backend-url.up.railway.app/api`).
   - Push this change to GitHub.
4. Railway will automatically build the React Vite app (it runs `npm run build` by default).
5. Go to **Settings > Networking** and **Generate Domain**. This is your final Live Application URL!

## Final Submission Checklist
- [x] Live application URL (Frontend Railway URL)
- [x] GitHub repository link
- [x] This README
- [ ] Record a 2–5 minute demo video explaining your code and showing the live app.
