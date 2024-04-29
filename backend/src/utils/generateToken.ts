import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { Response } from 'express';

const generateToken = (res: Response, userId: Object) => {
  const token = jwt.sign({ userId }, config.JWT_SECRET_KEY as string, {
    expiresIn: '1D',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: config.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};

export { generateToken };
