import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface User extends Document {
  name: string;
  email: string;
  password: string;
  matchPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
    },
    state: {
      // Write a model for user using twitter model
      
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User = model<User>('User', userSchema);
