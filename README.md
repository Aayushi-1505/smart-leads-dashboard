# Smart Leads Dashboard

A full-stack MERN lead management dashboard built from the supplied architecture. The frontend runs as a Vite, React, TypeScript, Redux Toolkit, and Tailwind CSS app. The backend is an Express, TypeScript, MongoDB, Mongoose, JWT, and bcrypt API.

## Features

- JWT authentication with login and registration.
- Protected dashboard routes.
- Admin and sales roles.
- Lead create, read, update, and admin-only delete.
- Search, status filter, source filter, sort, and pagination.
- Debounced search and loading/error states.
- CSV export.
- Mock frontend data by default, with a real backend ready through `VITE_USE_MOCKS=false`.
- Docker Compose setup for client, server, and MongoDB.

## Frontend Quick Start

```bash
npm install
npm run dev
```

The app includes demo mock users when `VITE_USE_MOCKS` is not set to `false`:

```text
Admin: admin@smartleads.dev / 123456
Sales: sales@smartleads.dev / 123456
```

## Backend Quick Start

```bash
cd server
npm install
npm run dev
```

Create a `.env` file from `.env.example` before starting the backend.

## Docker

```bash
cp .env.example .env
docker-compose up --build
```

The Docker setup runs:

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017/smart-leads-dashboard`

## API Routes

```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/leads
GET    /api/leads?page=1&limit=10&status=Qualified&source=Instagram&search=rahul&sort=latest
GET    /api/leads/:id
PUT    /api/leads/:id
DELETE /api/leads/:id
GET    /api/leads/export/csv
```

## Project Notes

- The existing Vite app is the frontend client, so frontend code lives in `src/` instead of a nested `client/src/` folder.
- Backend code follows the requested `server/src` folder layout.
- Set `VITE_USE_MOCKS=false` to make the frontend call the Express API.