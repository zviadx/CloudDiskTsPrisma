import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import "dotenv/config"


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
        return next()
    }
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(400).json({ message: "invalid token" })
        }
        const decoded = jwt.verify(token, process.env.SECRETKEY!) as JwtPayload & { id: number }
        console.log(decoded)
        req.user = decoded
        next()
    } catch (err: any) {
        console.log(err.message)
    }
}
