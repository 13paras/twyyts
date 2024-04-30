import createHttpError from 'http-errors';
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { signinBody, signupBody } from '../utils/userValidation';
import { generateTokenAndSetCookie } from '../utils/generateToken';
import { CustomRequest } from '../middlewares/auth.middleware';

// api/v1/auth/register => POST
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const body = req.body;
    const result = signupBody.safeParse(body);

    if (!result.success) {
      res.status(400).json(result.error);
    }

    const existedUser = await User.findOne({ username: body.username });

    if (existedUser) {
      const error = createHttpError(400, 'Username is already taken');
      return next(error);
    }

    const existingEmail = await User.findOne({ email: body.email });

    if (existingEmail) {
      const error = createHttpError(400, 'Email is already taken');
      return next(error);
    }

    const user = await User.create(body);

    if (user) {
      generateTokenAndSetCookie(res, user._id);

      res.status(200).json({
        message: 'User Created Successfully',
        id: user._id,
        username: user.username,
        fullName: user.fullName,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.log(error);
  }
});

// 'api/v1/auth/login' => POST
const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const body = req.body;
    const result = signinBody.safeParse(body);

    if (!result.success) {
      res.status(400).json(result.error);
    }

    const user = await User.findOne({
      $or: [{ email: body.email }, { username: body.username }],
    });

    if (user && (await user.matchPassword(body.password))) {
      generateTokenAndSetCookie(res, user._id);

      return res.status(200).json({
        message: 'User Logged In Successfully',
        id: user._id,
      });
    } else {
      const error = createHttpError(400, 'Invalid username/email or password');
      return next(error);
    }
  } catch (error) {
    console.log(error);
  }
});

// 'api/v1/auth/me' => GET
const getUser = asyncHandler(async (req: CustomRequest, res, next) => {
  try {
    const user = await User.findById(req.user?.id);

    res.status(200).json({
      message: 'User fetched successfully',
      data: {
        _id: user?.id,
        username: user?.username,
        email: user?.email,
      },
    });
  } catch (error: Error | any) {
    console.log(error);
    const err = createHttpError(500, error?.message);
    next(err);
  }
});

// 'api/v1/auth/logout' => POST
const logoutUser = asyncHandler(async (_, res) => {
  res.cookie('jwt', '', {
    expires: new Date(0),
  });
  res.status(200).json({
    message: 'User logged out',
  });
});

export { registerUser, loginUser, getUser, logoutUser };
