import express from "express"
import dotenv from "dotenv"
import { sql } from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

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

        await sql`
        CREATE TABLE IF NOT EXISTS sessions(
            user_id UUID NOT NULL,

            refresh_token_hash TEXT NOT NULL,
            ip TEXT NOT NULL,
            user_agent TEXT NOT NULL,
            revoked BOOLEAN NOT NULL DEFAULT FALSE,

            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),

            FOREIGN KEY(user_id) REFERENCES users(id)

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