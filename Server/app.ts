import express from 'express';
import prisma from "./db/prisma"
import authRouter from './routes/auth.router';
import fileRouter from './routes/file_routes';
import fileUpload from 'express-fileupload';
import corsMiddleware from './middleware/cors.middleware';
// import dotenv from 'dotenv';
// dotenv.config();

const PORT = process.env.PORT || 5555

const app = express();


app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.json())
app.use(express.static("static"))

app.use('/api/auth', authRouter)
app.use('/api/files', fileRouter)

const start = async () => {
    try {
        await prisma.$connect()
        app.listen(PORT, () => {
            console.log(`Server Is Running On Port ${PORT}`)
        })
    } catch (error: any) {
        console.log(error.message)
    }
}

start();

