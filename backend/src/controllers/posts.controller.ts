import createHttpError from 'http-errors';
import { asyncHandler } from '../utils/asyncHandler';
import { CustomRequest } from '../middlewares/auth.middleware';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { v2 as cloudinary } from 'cloudinary';

const createPost = asyncHandler(async (req: CustomRequest, res, next) => {
  try {
    const { text } = req?.body;
    let { img } = req.body;
    const userId = req.user.id.toString();

    const user = await User.findById(userId);

    if (!user) {
      const error = createHttpError(404, 'User not found');
      return next(error);
    }

    if (!text && !img) {
      const error = createHttpError(400, 'Please provide text or image');
      return next(error);
    }

    // ! Change this to uploadOnCloudinary function using multer
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();

    res.status(201).json({
      message: 'Post created successfully',
      newPost,
    });
  } catch (error: Error | any) {
    console.log(error.message);
    const err = createHttpError(500, error.message);
    return next(err);
  }
});

const likeAndUnlikePost = asyncHandler(async (req, res, next) => {});

const commentOnPost = asyncHandler(async (req, res, next) => {});

const deletePost = asyncHandler(async (req: CustomRequest, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if(post?.user.toString() === req.user.id) {
            return res.status(401).json({ error: "You are not authorized to delete this post"})
        }
    } catch (error: Error| any) {
        console.log(error.message)
    }
});

export { createPost, deletePost, likeAndUnlikePost, commentOnPost };
