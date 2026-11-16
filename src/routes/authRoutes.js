import express from "express"
import { handleLogin, handleRegister, handleRefresh, handleLogout, meHandler } from "../controllers/authController.js"
import { verifyUser } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/register", handleRegister)

router.post("/login", handleLogin)

router.post("/get-me", verifyUser, meHandler)

router.get("/refresh", verifyUser, handleRefresh)

router.get("/logout", verifyUser, handleLogout)

export default router