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

## Render deploy

### Frontend Static Site (critical — fixes CSS/JS 404)

If the browser shows:
`Refused to apply style... MIME type ('text/plain')`  
it usually means **assets 404** because the **Publish Directory is wrong**.

In the Render **Static Site** settings:

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

**Not** `frontend`, **not** `.`, **not** `build` — Vite outputs to `frontend/dist`.

Environment (build-time):

| Variable | Example |
|----------|---------|
| `VITE_SERVER_URL` | `https://realtime-socketio-chat.onrender.com` |

After changing settings: **Clear build cache → Manual Deploy**.

### Backend Web Service

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Backend env on Render

| Variable | Example |
|----------|---------|
| `MONGODB_URL` | your Atlas URI |
| `JWT_SECRET` | long random string |
| `CLOUD_NAME` | Cloudinary cloud name |
| `API_KEY` | key with **create/upload** permission |
| `API_SECRET` | matching secret |
| `CLIENT_URL` | `https://realtime-socketio-chat-mgz8.onrender.com` |
| `SERVER_URL` | `https://realtime-socketio-chat.onrender.com` |
| `NODE_ENV` | `production` |

Rebuild the frontend after changing `VITE_*` vars (they are baked in at build time).

### Cloudinary

API key must allow **create** (upload). Read-only keys return 403 and images break in production.

### Old broken images

Messages/profiles already saved as `http://localhost:8000/...` stay broken until you re-upload those images (or clear those fields in MongoDB).

## Scripts

- Backend: `npm run dev` / `npm start`
- Frontend: `npm run dev` / `npm run build`
