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

## Setup

### Backend

```bash
cd backend
npm install
# Create backend/.env with:
# PORT=8000
# MONGODB_URL=...
# JWT_SECRET=...
# CLOUD_NAME=...
# API_KEY=...
# API_SECRET=...
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. API defaults to `http://localhost:8000`.

## Notes

- Prefer **Node 20** for the backend.
- Image uploads try Cloudinary first; if the API key lacks create permission, files are served from `backend/public` as a local fallback.
- Keep `.env` out of git (already ignored).
