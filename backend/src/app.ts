import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';

const app = express();

const upload = multer();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(
  upload.fields([
    {
      name: 'profileImg',
      maxCount: 1,
    },
    {
      name: 'coverImg',
      maxCount: 1,
    },
  ])
);

// Router
import { router as userRouter } from './routes/user.routes';
import { router as authRouter } from './routes/auth.routes';
import { router as postRouter } from './routes/post.routes';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);

// Error Handlers
app.use(globalErrorHandler);

export { app };
