import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Router
import { router as userRouter } from './routes/user.routes';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';

app.use('/api/v1/user', userRouter);

// Error Handlers
app.use(globalErrorHandler);

export { app };
