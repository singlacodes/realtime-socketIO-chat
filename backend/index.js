import express from "express"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, server } from "./socket/socket.js"

const port = process.env.PORT || 8000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Default includes local + your Render frontend
const clientOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173,https://realtime-socketio-chat-mgz8.onrender.com"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || clientOrigins.includes("*") || clientOrigins.includes(origin)) {
            return callback(null, true)
        }
        console.warn("Blocked CORS origin:", origin)
        return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
// Uploaded images (local fallback when Cloudinary create is blocked)
app.use("/public", express.static(path.join(__dirname, "public")))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)

// Optional: serve Vite build from same service
const frontendDist = path.join(__dirname, "../frontend/dist")
app.use(express.static(frontendDist))
app.get(/^(?!\/api)(?!\/public)(?!\/socket\.io).*/, (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next()
    res.sendFile(path.join(frontendDist, "index.html"), (err) => {
        if (err) next()
    })
})

server.listen(port, () => {
    connectDb()
    console.log("server started on port", port)
    console.log("CORS origins:", clientOrigins.join(", "))
})
