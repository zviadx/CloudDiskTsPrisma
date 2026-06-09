import { Router, type Request, type Response } from "express"
// import User from "../models/User"
// import File from "../models/File"
import prisma from "../db/prisma"
import crypt from "bcryptjs"
import { check, validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

import userFolder from "../services/userFolder"


export const authRouter = Router()
dotenv.config()

authRouter.post('/registration',
    [
        check('email', "Enter valid email").isEmail(),
        check('password', "password must been between 4-64 symbols ").isLength({ min: 4, max: 64 })
    ],
    async (req: Request, res: Response) => {
        try {
            const validationError = validationResult(req)
            if (!validationError.isEmpty()) {
                return res.status(400).json({ errors: validationError.array() })
            }
            const { email, password } = req.body
            const isUser = await prisma.user.findUnique({
                where: { email }
            })

            if (isUser) {
                console.log(`user named ${email} already exists`)
                return res.status(400).json({ message: "user named this already exists" })
            }
            const pass = await crypt.hash(password, 8)
            const user = await prisma.user.create({
                data: {
                    email,
                    password: pass,
                }
            })

            await userFolder.createUserFolder({ user: user.id, path: "" })

            return res.status(200).json({ message: "User successfully registered " })

        } catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    })


authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const logged = await User.findOne({ email })
        if (!logged) {
            return res.status(400).json({ message: "User named like this is not in data base" })
        }
        const comparePass = crypt.compareSync(password, logged.password)
        if (!comparePass) {
            return res.status(400).json({ message: "Password is incorrect" })
        }
        const token = jwt.sign({ id: logged._id }, config.get("secretKey"), { expiresIn: "3h" })
        return (res.status(200).json({
            token,
            user: {
                id: logged._id,
                email: logged.email,
                diskSpace: logged.diskSpace,
                usedSpace: logged.usedSpace,
                avatar: logged.avatar,
            }
        })
        )

    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
})

export default authRouter