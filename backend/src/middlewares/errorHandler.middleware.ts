import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { config } from '../config/config';

const globalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: err.statusCode,
    message: err.message,
    errorStack: config.NODE_ENV === 'development' ? err.stack : null,
  });
};

export { globalErrorHandler };
