import { z } from 'zod';

const signupBody = z.object({
  username: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type SignupBody = z.infer<typeof signupBody>;

const signinBody = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type SigninBody = z.infer<typeof signinBody>;

const updateBody = z.object({
  username: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  currentPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
  profileImg: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) {
        return true;
      }
    }),
  coverImg: z.string().url().optional(),
  bio: z.string().optional(),
  link: z.string().url().optional(),
});

type UpdateBody = z.infer<typeof updateBody>;

export {
  signupBody,
  SignupBody,
  signinBody,
  SigninBody,
  updateBody,
  UpdateBody,
};
