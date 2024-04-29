import createHttpError from 'http-errors';
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { generateToken } from '../utils/generateToken';
import { signinBody, signupBody, updateBody } from '../utils/userValidation';
import { CustomRequest } from '../middlewares/auth.middleware';

// 'api/v1/user/register' => POST
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const body = req.body;
    const result = signupBody.safeParse(body);

    if (!result.success) {
      res.status(400).json(result.error);
    }

    const existedUser = await User.findOne({ email: body.email });

    if (existedUser) {
      const error = createHttpError(400, 'User already existed');
      return next(error);
    }

    const user = await User.create(body);

    if (user) {
      generateToken(res, user._id);

      res.status(200).json({
        message: 'User Created Successfully',
        id: user._id,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.log(error);
  }
});

// 'api/v1/user/login' => POST
const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const body = req.body;
    const result = signinBody.safeParse(body);

    if (!result.success) {
      res.status(400).json(result.error);
    }

    const user = await User.findOne({ email: body.email });

    if (user && (await user.matchPassword(body.password))) {
      generateToken(res, user._id);

      return res.status(200).json({
        message: 'User Logged In Successfully',
        id: user._id,
      });
    } else {
      const error = createHttpError(400, 'Invalid email or password');
      return next(error);
    }
  } catch (error) {
    console.log(error);
  }
});

// 'api/v1/user/profile' => PUT
const updateUser = asyncHandler(async (req: CustomRequest, res, next) => {
  try {
    //  Here in this we're getting "req.user" from auth middleware (verifyToken).
    const body = req.body;
    const validatedResult = updateBody.safeParse(body);

    if (!validatedResult.success) {
      const error = createHttpError(401, validatedResult.error);
      return next(error);
    }

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        $set: {
          name: body.name,
          // password: body?.password
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: 'User updated successfully',
      data: {
        _id: user?.id,
        name: user?.name,
      },
    });

    // Check if updateUser exists before sending response
  } catch (error) {
    console.log(error);
  }
});

// 'api/v1/user/profile' => GET
const getUserProfile = asyncHandler(async (req: CustomRequest, res) => {
  const user = await User.findById(req.user?.id);

  res.status(200).json({
    message: 'User fetched successfully',
    data: {
      _id: user?.id,
      name: user?.name,
      email: user?.email,
    },
  });
});

const logoutUser = asyncHandler(async (_, res) => {
  res.cookie('jwt', '', {
    expires: new Date(0),
  });
  res.status(200).json({
    message: 'User logged out',
  });
});

export { registerUser, loginUser, updateUser, logoutUser, getUserProfile };
