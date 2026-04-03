import dotenv from 'dotenv'
dotenv.config() 
import cors from "cors";
import express from 'express'
import userRouter from './routes/auth.js'
import cookieParser from "cookie-parser";
import jobRouter from './routes/job.js';
import applicantRouter from './routes/applicant.js';

const app = express()

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use(cors({ 
  origin: "http://localhost:3001", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const PORT = process.env.PORT || 3000

app.use('/api/auth', userRouter)
app.use('/api/job', jobRouter)
app.use('/api/applicant', applicantRouter)


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})