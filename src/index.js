import express from "express"
import cors from "cors"
import { PORT } from "./config/env.config.js"
import authRoute from "./routes/auth.route.js"
import { connectDB } from "./config/db.config.js"
import cookie from "cookie-parser"
import journalRoute from "./routes/journal.route.js"
import projectRoute from "./routes/project.route.js"
import userRoute from "./routes/user.route.js"
import githubSyncRoute from "./routes/githunSync.route.js"
import resumeRoute from "./routes/resume.route.js"
const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookie())

app.use("/api/auth",authRoute)
app.use("/api/journal",journalRoute)
app.use("/api/project",projectRoute)
app.use("/api/user",userRoute)
app.use("/api/github",githubSyncRoute)
app.use("/api/resume",resumeRoute)

app.listen( PORT, async ()=>{
    await connectDB();
     console.log("Server is running on port", PORT)
});