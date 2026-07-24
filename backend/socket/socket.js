import http from "http"
import express from "express"
import { Server } from "socket.io"

let app = express()

const server = http.createServer(app)

const clientOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173,https://realtime-socketio-chat-mgz8.onrender.com"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)

const io = new Server(server, {
  cors: {
    origin: clientOrigins,
    credentials: true,
  },
})

const userSocketMap = {}
export const getReceiverSocketId = (receiver) => {
  return userSocketMap[receiver]
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  if (userId != undefined) {
    userSocketMap[userId] = socket.id
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

export { app, server, io }
