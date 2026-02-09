import express from 'express'
import dotenv from 'dotenv'
import resumeRouter from './routes/resume.routes.js'
import atsRouter from './routes/ats.routes.js'
import connectDB from './utils/db.js';
import cors from 'cors';

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/resumes', resumeRouter);
app.use('/api/ats', atsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
