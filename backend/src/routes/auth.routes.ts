import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/auth.controller';

const router = express.Router();

// POST - create user
// POST - get user
// PUT - update user
// GET - get user
// POST - logout user

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', verifyToken, getUser);

export { router };
