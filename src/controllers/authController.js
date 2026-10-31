import argon2 from "argon2"
import { sql } from "../config/db.js"
import jwt, { decode } from "jsonwebtoken"

export const handleRegister = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please check your inputs!"
            })
        }

        const userExists = await sql`
            SELECT * FROM users WHERE email=${email}
        `

        if (userExists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User is already registered!"
            })
        }

        const hashedPassword = await argon2.hash(password)

        const user = await sql`
            INSERT INTO users(email, password)
            VALUES (${email}, ${hashedPassword})
            RETURNING *
        `

        const token = jwt.sign({
            id: user[0].id
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            })

        res.status(201).json({
            success: true,
            data: {
                id: user[0].id,
                email: user[0].email
            },
            message: "User registered successfully!"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please check your inputs!"
            })
        }

        const user = await sql`
            SELECT * FROM users WHERE email=${email}
        `

        if (!user.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User does not exist!"
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getMe = async(req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        if(!token) {
            res.status(401).json({
                success:false,
                message:"token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await sql`
            SELECT * FROM users WHERE id=${decoded.id}
        `

        res.status(200).json({
            success:true,
            data:{
                email:decoded.email,
            }
        })
    } catch (error) {
                res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}