import express from "express";
import cors from "cors";
import { connectDB } from './config/db';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import userReportRoutes from './routes/reportsRoutes';
import tasksRoutes from './routes/taskRoutes';

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorisation"],
    })
);

connectDB();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/task', tasksRoutes);
app.use('/api/reports', userReportRoutes);

const Port = process.env.PORT || 5000;
app.listen(Port, () => console.log(`Server running in the port ${Port}`))