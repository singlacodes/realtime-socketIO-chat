# realtime-socketIO-chat

Real-time chat app built with React, Express, MongoDB, and Socket.IO.

## Features

- User signup / login (JWT + cookies)
- Real-time messaging with Socket.IO
- Profile edit with image upload
- Image messages in chat
- Online user list and search

## Project structure

```
backend/   # Express API + Socket.IO server
frontend/  # React (Vite) client
```

## Local setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in values
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_SERVER_URL=http://localhost:8000
npm run dev
```

Open `http://localhost:5173`.

## Render deploy (important for images)

Images fail on Render if the app still stores `http://localhost:8000/public/...` URLs.  
Use **Cloudinary** (recommended) or set a **public** `SERVER_URL`.

### Backend env on Render

| Variable | Example |
|----------|---------|
| `MONGODB_URL` | your Atlas URI |
| `JWT_SECRET` | long random string |
| `CLOUD_NAME` | Cloudinary cloud name |
| `API_KEY` | key with **create/upload** permission |
| `API_SECRET` | matching secret |
| `CLIENT_URL` | `https://your-frontend.onrender.com` |
| `SERVER_URL` | `https://your-backend.onrender.com` |
| `CROSS_SITE_COOKIES` | `true` if FE and BE are different hosts |
| `NODE_ENV` | `production` |

### Frontend build env on Render

| Variable | Example |
|----------|---------|
| `VITE_SERVER_URL` | `https://your-backend.onrender.com` |

Rebuild the frontend after changing `VITE_*` vars (they are baked in at build time).

### Cloudinary

API key must allow **create** (upload). Read-only keys return 403 and images break in production.

### Old broken images

Messages/profiles already saved as `http://localhost:8000/...` stay broken until you re-upload those images (or clear those fields in MongoDB).

## Scripts

- Backend: `npm run dev` / `npm start`
- Frontend: `npm run dev` / `npm run build`
