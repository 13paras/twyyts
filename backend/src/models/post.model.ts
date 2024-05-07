import { Schema, Types, model } from 'mongoose';

interface Post extends Document {
  user: Types.ObjectId;
  text: string;
  img: string;
  likes: Types.ObjectId[];
  comments: {
    text: string;
    user: Types.ObjectId;
  }[];
}

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    likes: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Post = model<Post>('Post', postSchema);
