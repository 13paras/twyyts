import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user.model';
import createHttpError from 'http-errors';
import { config } from '../config/config';

export interface CustomRequest extends Request {
  user?: object | any;
}

export const verifyToken = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.jwt;

      if (!token) {
        const error = createHttpError(401, 'Unauthorized Request');
        return next(error);
      }

      const decodedTokenInfo = jwt.verify(
        token,
        config.JWT_SECRET_KEY as string
      ) as JwtPayload;

      const user = await User.findById(decodedTokenInfo?.userId);

      if (!user) {
        const error = createHttpError(401, 'Invalid Token');
        return next(error);
      }

      req.user = user;

      next();
    } catch (error: string | any) {
      const err = createHttpError(
        401,
        error?.message || 'Invalid Access Token'
      );
      return next(err);
    }
  }
);
