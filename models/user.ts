import * as mongoose from 'mongoose';
import { compare } from 'bcrypt';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Post } from '.';
import { UserSchema, UserModel } from '../interfaces';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  surname: String,
  profileImage: {
    name: String,
    size: Number,
    mimetype: String,
    url: String,
  },
  posts: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  ],
  following: [
    {
      _id: false,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  followers: [
    {
      _id: false,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
});

userSchema.methods.comparePassword = async function
  comparePassword(candidatePassword: string, next: NextFunction) {
  try {
    const isMatch = await compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};

userSchema.statics.getUsersPosts = async function
  getUsersPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const usersPosts = Post.find({ author: id });
    const postsWithUser = await usersPosts.populate({
      path: 'author',
      model: 'User',
    });
    return res.status(200).json(postsWithUser);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

userSchema.statics.getPostsFromFollowedUsers = async function
  getPostsFromFollowedUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const idsFollowedUsers = user?.following.map((followed) => followed.user);
    const posts = Post.find({ author: { $in: idsFollowedUsers } });
    const postsWithUsers = await posts.populate({
      path: 'author',
      model: 'User',
    });
    return res.status(200).json(postsWithUsers);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

userSchema.statics.getFollowing = async function
  getFollowing(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: 'following.user',
    });
    return res.status(200).json(user?.following);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

userSchema.statics.getFollowers = async function
  getFollowers(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: 'followers.user',
    });
    return res.status(200).json(user?.followers);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

userSchema.statics.getFilteredUsers = async function
  getFilteredUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { term } = req.params;
    const regex = new RegExp(`${term}`, 'i');
    const conditions = { $or: [{ name: { $regex: regex } }, { surname: { $regex: regex } }] };
    const users = await User.find(conditions);
    return res.status(200).json(users);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

const User = mongoose.model<UserSchema, UserModel>('User', userSchema);

export default User;
