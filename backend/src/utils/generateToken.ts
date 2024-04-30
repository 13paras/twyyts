import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { Response } from 'express';

const generateTokenAndSetCookie = (res: Response, userId: Object) => {
  const token = jwt.sign({ userId }, config.JWT_SECRET_KEY as string, {
    expiresIn: '1D',
  });

  res.cookie('jwt', token, {
    httpOnly: true, // prevent XSS attacks by the browser
    secure: config.NODE_ENV !== 'development',
    sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });
};

export { generateTokenAndSetCookie };
