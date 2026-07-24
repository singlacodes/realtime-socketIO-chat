import http from "http";
import express from "express";
import { Server } from "socket.io";

let app = express();

const server = http.createServer(app);

const clientOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173,https://realtime-socketio-chat-mgz8.onrender.com"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: clientOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// userId (string) -> socket.id
const userSocketMap = {};

export const getReceiverSocketId = (receiver) => {
  if (receiver == null) return undefined;
  return userSocketMap[String(receiver)];
};

const getOnlineUserIds = () => Object.keys(userSocketMap);

const broadcastOnlineUsers = () => {
  io.emit("getOnlineUsers", getOnlineUserIds());
};

io.on("connection", (socket) => {
  const raw = socket.handshake.query?.userId;
  const userId =
    raw != null && raw !== "" && String(raw) !== "undefined"
      ? String(raw)
      : null;

  if (userId) {
    // If user reconnects, replace old socket mapping
    userSocketMap[userId] = socket.id;
    socket.data.userId = userId;
  }

  // Tell everyone (including this client) who is online
  broadcastOnlineUsers();

  // Client can re-request after attaching listeners (avoids race)
  socket.on("requestOnlineUsers", () => {
    socket.emit("getOnlineUsers", getOnlineUserIds());
  });

  socket.on("disconnect", () => {
    const id = socket.data.userId || userId;
    if (id && userSocketMap[id] === socket.id) {
      delete userSocketMap[id];
    }
    broadcastOnlineUsers();
  });
});

export { app, server, io };
