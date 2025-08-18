import express from "express"
import { PORT } from "./config/env.config.js"
import authRoute from "./routes/auth.route.js"
import { connectDB } from "./config/db.config.js"

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use("/api/auth",authRoute)


app.listen( PORT, async ()=>{
    await connectDB();
     console.log("Server is running on port", PORT)
});