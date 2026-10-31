import express from "express"
import dotenv from "dotenv"
import { sql } from "./config/db.js"
import authRouter from "./routes/authRoutes.js"

dotenv.config()

const app = express()

app.use(express.json())

app.use("/api/auth", authRouter)

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY UNIQUE NOT NULL DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `
    } catch (error) {
        console.log(error)
    }
}

initDB()

app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`)
})