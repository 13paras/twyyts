import createHttpError from 'http-errors';
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { updateBody } from '../utils/userValidation';
import { CustomRequest } from '../middlewares/auth.middleware';
import { Notification } from '../models/notification.model';
import { uploadOnCloudinary } from '../utils/cloudinary';
import { Request, Response } from 'express';

// ! Update/add -> file upload function(logic) using multer

// 'api/v1/user/profile/:username' => GET
const getUserProfile = asyncHandler(async (req: CustomRequest, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      const error = createHttpError(404, 'User not found');
      return next(error);
    }

    res.status(200).json({
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error: Error | any) {
    console.log(error);
    const err = createHttpError(500, error.message);
    next(err);
  }
});

// 'api/v1/user/follow/:id' => POST
const followUnfollowUser = asyncHandler(
  async (req: CustomRequest, res, next) => {
    // We have to do the modifications in both the users, such as adding the current user to the "following" field of the user and vice versa.
    // store currentUser and user to be followed/unfollowed (userToModify)
    // check wether current user and usertomodify are true
    // if not throw error
    // if else condition ->
    // check if the userToModify is already in the "following" field of the current user
    // if yes then write a logic to unfollow it such as findAndUpdate and use pull method
    // if the userToModify is not in the "following" field of the current user then write a logic to follow it such as findAndUpdate and use push method
    // return success message for both
    // return error if any

    try {
      const { id } = req.params;

      if (req.user?.id.toString() === id) {
        const error = createHttpError(400, 'You cannot follow yourself');
        return next(error);
      }

      // getting both the user
      const userToModify = await User.findById(id);
      const currentUser = await User.findById(req.user.id);

      if (!userToModify || !currentUser) {
        const error = createHttpError(404, 'User not found');
        return next(error);
      }

      // logic to follow and unfollow user
      if (userToModify.followers.includes(req.user.id)) {
        // Unfollow the user
        await User.findByIdAndUpdate(id, {
          $pull: { followers: req.user.id },
        });
        await User.findByIdAndUpdate(req.user.id, {
          $pull: { following: id },
        });

        // TODO return id of the user as a response
        res.status(200).json({ message: 'User unfollowed successfully' });
      } else {
        // follow the user
        await User.findByIdAndUpdate(id, {
          $push: { followers: req.user.id },
        });
        await User.findByIdAndUpdate(req.user.id, {
          $push: { following: id },
        });

        // Send notifications to user
        const newNotification = new Notification({
          type: 'follow',
          from: req.user.id,
          to: id,
        });

        await newNotification.save();

        // TODO return id of the user as a response
        res.status(200).json({ message: 'User followed successfully' });
      }
    } catch (error: Error | any) {
      console.log(error);
      const err = createHttpError(500, error.message);
      return next(err);
    }
  }
);

// 'api/v1/user/suggested' => GET
const getSuggestedUsers = asyncHandler(
  async (req: CustomRequest, res, next) => {
    try {
      const userId = req.user?.id;

      // Find users that the current user does not follow
      const users = await User.find({
        _id: { $nin: req.user?.following },
      })
        .select('-password')
        .limit(5);

      res.status(200).json({ success: true, data: users });
    } catch (error: Error | any) {
      console.log('Error in getSuggestedUsers: ', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// 'api/v1/user/profile' => PUT
const updateUser = asyncHandler(async (req: CustomRequest, res, next) => {
  // nothing is required to update
  // but if we want to update any of the below fields
  // get user from user id
  // let's start by password
  // check both current pass and new password
  // if any of them is not valid or true then throw error
  // if true then check if the password is correct with the predifined method
  // then store update in user
  // do this for all the fields and at last await and save them

  const body = req.body;
  const validatedResult = updateBody.safeParse(body);

  const { fullName, username, email, currentPassword, newPassword, bio, link } =
    body;

  const profileImgPath = req.file?.path as string;

  if (!validatedResult.success) {
    const error = createHttpError(401, validatedResult.error);
    return next(error);
  }

  try {
    // console.log(body);
    let user = await User.findById(req.user?.id);

    if (!user) {
      const error = createHttpError(404, 'User not found');
      return next(error);
    }

    if (
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      const error = createHttpError(
        401,
        'Please provide both current password and new password'
      );
      return next(error);
    }

    let isPasswordCorrect;

    if (currentPassword && newPassword) {
      isPasswordCorrect = await user.matchPassword(currentPassword);
    }

    if (!isPasswordCorrect) {
      const error = createHttpError(400, 'Invalid password');
      return next(error);
    }

    if (newPassword) {
      user.password = newPassword;
    }

    // const profileImage = await uploadOnCloudinary(profileImgPath);

    // user.profileImg = profileImage?.url as string;
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    // console.log(user);

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        bio: user.bio,
        link: user.link,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

/* const updateProfileAndCoverImg = asyncHandler(async (req: CustomRequest, res, next) => {
  try {
    const profileImgFile = (req.files as { [fieldname: string]: Express.Multer.File[] })['profileImg'][0];

  } catch (error) {
    console.log(error)
  }

}) */

export { getUserProfile, followUnfollowUser, updateUser, getSuggestedUsers };
