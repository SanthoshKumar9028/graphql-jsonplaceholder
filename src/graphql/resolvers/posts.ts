import mongoose from "mongoose";
import Post from "../../models/Post";
import User from "../../models/User";
import { ISchemaLevelResolver } from "@graphql-tools/utils";
import { GLContext, PubSubTriggers } from "../types";

export const getPosts = async (parent, args, context) => {
  console.log("context", context);

  const posts = await Post.find();
  return posts;
};

export const getPostById = async (parent, args) => {
  const post = await Post.findById(args.id);
  return post;
};

export const createPost: ISchemaLevelResolver<any, GLContext> = async (
  parent,
  args,
  context,
  info
) => {
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

  context.pubsub.publish(PubSubTriggers.POST_CREATED, savedPost);

  postMetrics(parent, args, context, info).then((result) => {
    context.pubsub.publish(PubSubTriggers.POST_METRICS, result);
  });

  return savedPost;
};

export const updatePost = async (parent, args) => {
  const post = await Post.findByIdAndUpdate(args.id, args.payload, {
    new: true,
  });
  return post;
};

export const deletePostById: ISchemaLevelResolver<any, GLContext> = async (
  parent,
  args,
  context,
  info
) => {
  const post = await Post.findByIdAndDelete(args.id);

  postMetrics(parent, args, context, info).then((result) => {
    context.pubsub.publish(PubSubTriggers.POST_METRICS, result);
  });

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

export const postMetrics: ISchemaLevelResolver<any, GLContext> = async () => {
  const totalCount = await Post.countDocuments();

  return { totalCount };
};

export const postCreated: ISchemaLevelResolver<any, GLContext> = async (
  parent,
  args,
  context
) => {
  return context.pubsub.asyncIterableIterator(PubSubTriggers.POST_CREATED);
};

export const postMetricsSubscription: ISchemaLevelResolver<
  any,
  GLContext
> = async (parent, arg, context) => {
  return context.pubsub.asyncIterableIterator(PubSubTriggers.POST_METRICS);
};

export default {
  query: {
    posts: getPosts,
    getPostById,
    getPostComments,
    postMetrics,
  },
  mutation: {
    createPost,
    updatePost,
    deletePostById,
    addCommentInPost,
  },
  subscription: {
    postCreated: {
      subscribe: postCreated,
      resolve: (result) => result,
    },
    postMetrics: {
      subscribe: postMetricsSubscription,
      resolve: (result) => result,
    },
  },
};
