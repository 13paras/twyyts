import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from '../controllers/user.controller';
import { upload } from '../middlewares/multer.middleware';

const router = express.Router();

router.get('/profile/:username', verifyToken, getUserProfile);
router.get('/suggested', verifyToken, getSuggestedUsers);
router.post('/follow/:id', verifyToken, followUnfollowUser);
router.put(
  '/update',
  verifyToken,
  /* upload.fields([
    {
      name: 'profileImg',
      maxCount: 1,
    },
    {
      name: 'coverImg',
      maxCount: 1,
    },
  ]), */
  updateUser
);

export { router };
