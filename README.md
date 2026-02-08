# Angular + Node.js + MongoDB (Docker)

## Services

- Angular frontend (port 4200)
- Node.js/Express backend (port 3000)
- MongoDB (port 27017)

## Run with Docker

1. Build and start all services:
   - `docker compose up --build`
2. Open the app:
   - http://localhost:4200

## Local development (optional)

- Backend:
  - `cd backend`
  - `npm install`
  - `npm start`
- Frontend:
  - `cd frontend`
  - `npm install`
  - `npm start`

The frontend uses a proxy to route `/api` requests to the backend.

## Auth (JWT)

Backend endpoints:

- `POST /api/auth/register` → `{ token, email }`
- `POST /api/auth/login` → `{ token, email }`
- `GET /api/auth/me` (requires `Authorization: Bearer <token>`) → `{ email }`

Set `JWT_SECRET` in the backend environment for production.
