import mongoose from "mongoose";
import Post from "../../models/Post";
import User from "../../models/User";

export const getPosts = async () => {
  const posts = await Post.find();
  return posts;
};

export const getPostById = async (parent, args) => {
  const post = await Post.findById(args.id);
  return post;
};

export const createPost = async (parent, args) => {
  const user = await User.findById(args.payload.userId);

  if (!user) {
    throw new Error(`User with id(${args.payload.userId}) not found`);
  }

  const session = await mongoose.startSession();

  const savedPost = await session
    .withTransaction(async () => {
      const post = new Post(args.payload);
      await post.save({ session });

      user.posts.push(post._id);
      await user.save({ session });

      return post;
    })
    .catch(() => {
      return null;
    });

  return savedPost;
};

export const updatePost = async (parent, args) => {
  const post = await Post.findByIdAndUpdate(args.id, args.payload, {
    new: true,
  });
  return post;
};

export const deletePostById = async (parent, args) => {
  const post = await Post.findByIdAndDelete(args.id);
  return post;
};

export const getPostComments = async (parent, args) => {
  const post = await Post.findById(args.id);
  if (!post) throw new Error("Post not found");
  return post.comments;
};

export const addCommentInPost = async (parent, args) => {
  const post = await Post.findById(args.payload.postId);
  if (!post) throw new Error("Post not found");

  post.comments.push({
    content: args.payload.content,
    user: { userId: args.payload.userId, userName: args.payload.userName },
  });

  await post.save();

  return post.comments[post.comments.length - 1];
};

export default {
  query: {
    posts: getPosts,
    getPostById,
    getPostComments,
  },
  mutation: {
    createPost,
    updatePost,
    deletePostById,
    addCommentInPost,
  },
};
