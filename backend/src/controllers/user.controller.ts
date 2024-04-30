import createHttpError from 'http-errors';
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { generateTokenAndSetCookie } from '../utils/generateToken';
import { signinBody, signupBody, updateBody } from '../utils/userValidation';
import { CustomRequest } from '../middlewares/auth.middleware';


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
        username: user?.username,
        fullName: user?.fullName,
      },
    });

    // Check if updateUser exists before sending response
  } catch (error: Error | any) {
    console.log(error);
    const err = createHttpError(500, error?.message);
    next(err)
  }
});


