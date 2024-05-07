import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { commentOnPost, createPost, deletePost, likeAndUnlikePost } from '../controllers/posts.controller';

const router = express.Router();

router.post('/create', verifyToken, createPost);
router.post('/like/:id', verifyToken, likeAndUnlikePost)
router.post('/comment/:id', verifyToken, commentOnPost)
router.delete('/', verifyToken, deletePost);

export { router } 