import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import verifyUser from './middleware/verifyUser.js'
import dotenv from 'dotenv'
// import { createServer } from 'http'
// import { Server } from 'socket.io'
import bodyParser from 'body-parser'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import postCommentRoutes from './routes/postCommentRoutes.js'
import communityRoutes from './routes/communityRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import roles from './middleware/roles.js'


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users',verifyUser(roles.USER), userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/posts', postCommentRoutes); 
app.use('/api/communities', communityRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 8085

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})