import express from "express"
import { getMe, handleLogin, handleRegister } from "../controllers/authController.js"

const router = express.Router()

router.post("/register", handleRegister)

router.post("/login", handleLogin)

router.post("get-me", getMe)

export default router