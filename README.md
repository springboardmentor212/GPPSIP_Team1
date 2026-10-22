# PolicyGPT — GPPSIP Team 1

> A full-stack web application that enables citizens, government officials, researchers, and organisations to access, search, analyse, and understand government policies, schemes, regulations, circulars, and public welfare programs — powered by AI.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Getting Started (Local Development)](#getting-started-local-development)
6. [Environment Variables](#environment-variables)
7. [Deployment](#deployment)
   - [Render (Monolith — Frontend + Backend)](#render-monolith--frontend--backend)
   - [Vercel (Frontend Only)](#vercel-frontend-only)
8. [API Reference](#api-reference)
9. [Contributing](#contributing)
10. [License](#license)

---

## Overview

PolicyGPT is a platform that simplifies access to Indian government policies and welfare schemes. It provides:

- A smart **AI Assistant** (powered by Google Gemini) that answers policy and scheme queries in natural language
- Role-based access for **Citizens**, **Government Officials**, **Researchers**, and **Super Admins**
- Full **CRUD and approval workflows** for policies, schemes, and circulars
- **Analytics and reports** dashboards
- Document upload and **RAG (Retrieval Augmented Generation)** for querying real policy PDFs

---

## Tech Stack

| Layer      | Technology                                               |
|------------|----------------------------------------------------------|
| Frontend   | React 19, Vite 7, TailwindCSS 4, React Router 7         |
| Backend    | Node.js, Express 5, MongoDB (Mongoose 9)                 |
| Auth       | JWT (HttpOnly cookies + Bearer token)                    |
| AI         | Google Gemini API                                        |
| PDF        | pdf-parse, jsPDF, jspdf-autotable                        |
| Validation | Joi, Zod                                                 |
| Dev Tools  | Nodemon, ESLint, Vite HMR                                |
| Deployment | Render (monolith), Vercel (frontend), MongoDB Atlas      |

---

## Project Structure

```
PolicyGPT/                          ← repo root (monolith config lives here)
├── package.json                    ← root scripts for Render build/start
├── render.yaml                     ← Render IaC deployment config
├── vercel.json                     ← Vercel deployment config (frontend)
│
├── backend/                        ← Express API server
│   ├── server.js                   ← entry point
│   ├── package.json
│   ├── .env.example                ← env variable reference
│   └── src/
│       ├── app.js                  ← Express app, middleware, routes
│       ├── config/                 ← DB connection, env validator
│       ├── controllers/            ← Route handler logic
│       ├── middlewares/            ← Auth, error, upload middleware
│       ├── models/                 ← Mongoose schemas
│       ├── routes/                 ← Express routers (20 route files)
│       ├── scripts/                ← DB seed scripts
│       ├── utils/                  ← Helper utilities
│       └── validations/            ← Request validation schemas
│
└── frontend/                       ← React SPA (Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env.example                ← env variable reference
    └── src/
        ├── App.jsx
        ├── app.routes.jsx          ← React Router route definitions
        ├── main.jsx
        ├── assets/
        ├── components/             ← Reusable UI components
        │   ├── cards/
        │   ├── common/
        │   ├── dashboard/
        │   ├── forms/
        │   ├── layout/
        │   ├── modals/
        │   ├── tables/
        │   └── ui/
        ├── context/                ← React Context providers
        ├── features/               ← Feature-level modules (auth, etc.)
        ├── hooks/                  ← Custom React hooks
        ├── pages/                  ← Page-level components
        │   ├── AIAssistant/
        │   ├── Analytics/
        │   ├── Applications/
        │   ├── Circulars/
        │   ├── Dashboard/
        │   ├── Eligibility/
        │   ├── Feedback/
        │   ├── Notifications/
        │   ├── Policies/
        │   ├── Profile/
        │   ├── Reports/
        │   ├── Schemes/
        │   ├── Settings/
        │   ├── SuperAdmin/
        │   ├── LandingPage.jsx
        │   └── NotFoundPage.jsx
        └── services/               ← Axios API service functions
```

---

## Features

### 🔐 Authentication & Roles
- JWT-based auth with secure HttpOnly cookies + Bearer token
- **4 roles:** Citizen, Official, Researcher, Super Admin
- Official and Organisation verification flows
- Role-based route protection (RBAC)

### 📋 Policies & Schemes
- Browse, search, filter, and save government policies and schemes
- Advanced eligibility checking engine
- Side-by-side policy comparison
- Approval / maker-checker workflow for officials

### 🤖 AI Assistant
- Chat with an AI powered by Google Gemini
- Chat history with sessions
- RAG: query real uploaded PDF documents

### 📁 Circulars & Uploads
- Upload policy PDFs (multer)
- Circular management with document chunking for vector search

### 📊 Analytics & Reports
- Live dashboard with metrics
- Exportable reports (PDF, Excel via jsPDF + xlsx)
- Department-level analytics

### 🔔 Notifications
- In-app notification system
- Application tracking for citizens

### 🛠️ Super Admin
- Full platform management
- User administration panel

---

## Getting Started (Local Development)

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/springboardmentor212/GPPSIP_Team1.git
cd GPPSIP_Team1
```

### 2. Set up backend

```bash
cd backend
cp .env.example .env
# Edit .env and fill in your MONGO_URI, JWT_SECRET, GEMINI_API_KEY, etc.
npm install
npm run dev        # starts on http://localhost:3000
```

### 3. Set up frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:3000/api  (already set by default)
npm install
npm run dev        # starts on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Description                                        | Required |
|-------------------|----------------------------------------------------|----------|
| `PORT`            | Server port (default: `3000`)                      | No       |
| `NODE_ENV`        | `development` or `production`                      | Yes      |
| `MONGO_URI`       | MongoDB Atlas connection string                    | Yes      |
| `JWT_SECRET`      | Secret for signing JWT tokens                      | Yes      |
| `SUPER_ADMIN_KEY` | Key required to register a Super Admin account     | Yes      |
| `GEMINI_API_KEY`  | Google Gemini API key for AI Assistant             | Yes      |
| `FRONTEND_URL`    | Allowed CORS origin (your frontend URL)            | Yes      |

See [`backend/.env.example`](./backend/.env.example) for a template.

### Frontend (`frontend/.env`)

| Variable       | Description                               | Required |
|----------------|-------------------------------------------|----------|
| `VITE_API_URL` | Base URL of the backend API               | Yes      |

See [`frontend/.env.example`](./frontend/.env.example) for a template.

---

## Deployment

### Render (Monolith — Frontend + Backend)

Deploy the **entire app as a single Render web service**. The Express backend serves both the API and the built React SPA.

#### Steps

1. Push this branch to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Web Service** → connect your GitHub repo.
3. Render will auto-detect `render.yaml`. Alternatively, set manually:

   | Setting        | Value                  |
   |----------------|------------------------|
   | **Root Dir**   | `.` (repo root)        |
   | **Build Cmd**  | `npm run build`        |
   | **Start Cmd**  | `npm start`            |
   | **Node version** | `18` or higher       |

4. In the **Environment** tab on Render, add all backend env vars:

   ```
   NODE_ENV=production
   MONGO_URI=<your atlas URI>
   JWT_SECRET=<your secret>
   SUPER_ADMIN_KEY=<your key>
   GEMINI_API_KEY=<your key>
   FRONTEND_URL=https://your-app.onrender.com
   ```

5. Click **Deploy**. Your app will be live at `https://your-app.onrender.com`.

> **How it works:** `npm run build` installs deps for both frontend and backend, then runs `vite build`. `npm start` launches the Express server with `NODE_ENV=production`, which statically serves `frontend/dist/` and falls back to `index.html` for all non-API routes.

---

### Vercel (Frontend Only)

Deploy **only the React frontend** on Vercel, pointing to your Render backend.

#### Steps

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo.
2. Vercel will detect `vercel.json` at the root. Set the following overrides:

   | Setting               | Value                    |
   |-----------------------|--------------------------|
   | **Framework Preset**  | Vite                     |
   | **Root Directory**    | `frontend`               |
   | **Build Command**     | `npm run build`          |
   | **Output Directory**  | `dist`                   |

3. In **Environment Variables** on Vercel, set:

   ```
   VITE_API_URL=https://your-render-app.onrender.com/api
   ```

4. Click **Deploy**. Your frontend will be live at `https://your-app.vercel.app`.

5. **Update CORS on Render:** Go back to your Render service and set:

   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

> **SPA routing:** The `vercel.json` rewrites all routes to `index.html` so React Router handles `/dashboard`, `/policy/:id`, etc. correctly without 404s.

---

## API Reference

All endpoints are prefixed with `/api`.

| Resource         | Base Path               | Methods                      |
|------------------|-------------------------|------------------------------|
| Auth             | `/api/auth`             | POST login/register/logout   |
| Profile          | `/api/profile`          | GET, PUT                     |
| Policies         | `/api/policies`         | GET, POST, PUT, DELETE       |
| Policy Approval  | `/api/policies`         | POST (approval workflow)     |
| Schemes          | `/api/schemes`          | GET, POST, PUT, DELETE       |
| Eligibility      | `/api/schemes`          | POST /check-eligibility      |
| Saved Policies   | `/api/saved-policies`   | GET, POST, DELETE            |
| Saved Schemes    | `/api/saved-schemes`    | GET, POST, DELETE            |
| Circulars        | `/api/circulars`        | GET, POST                    |
| Search           | `/api/search`           | GET                          |
| Compare          | `/api/compare`          | POST                         |
| Recommendations  | `/api/recommendations`  | GET                          |
| Applications     | `/api/applications`     | GET, POST, PUT               |
| Notifications    | `/api/notifications`    | GET, PUT                     |
| Feedback         | `/api/feedback`         | GET, POST                    |
| Analytics        | `/api/analytics`        | GET                          |
| Reports          | `/api/reports`          | GET, POST                    |
| AI Assistant     | `/api/assistant`        | POST                         |
| Admin            | `/api/admin`            | GET, PUT, DELETE             |
| Upload           | `/api/upload`           | POST (multipart)             |
| Health Check     | `/health`               | GET                          |

---

## Contributing

1. Fork the repo and create a feature branch from `dev`:
   ```bash
   git checkout -b feat/your-feature-name dev
   ```
2. Follow the existing commit convention:
   - `feat:` new feature
   - `fix:` bug fix
   - `chore:` config/tooling changes
   - `docs:` documentation only
3. Run ESLint before committing:
   ```bash
   cd frontend && npx eslint src/
   ```
4. Open a PR against the `dev` branch with a clear title and description.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

*© 2026 PolicyGPT — GPPSIP Team 1, Infosys Springboard*
