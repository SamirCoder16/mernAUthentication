import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectToDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';


//  port number initialies 
const PORT = process.env.PORT || 5000;

const app = express();

//  Mongodb connection function .
connectToDB();

// CORS setup for local development environment. Replace this with your domain name when deploying to production.
const allowedOrigins = ['http://localhost:5173']

// Middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins , credentials : true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API's || Routes
app.get('/', (req,res,next)=>{
    res.send("hello proggramers");
})
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})