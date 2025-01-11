import mongoose, { Schema } from "mongoose";

export const commentUserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  userName: { type: String, required: true },
});

export const commentSchema = new Schema({
  content: { type: String, required: true },
  user: commentUserSchema,
});

export const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  comments: [commentSchema],
});

export const postTypeDef = `
  type CommentUser {
    userId: ID!
    userName: String!
  }

  type Comment {
    id: ID!
    content: String!
    user: CommentUser!
  }

  type Post {
    id: ID!
    userId: ID!
    title: String!
    content: String!
    comments: [Comment]
  }
`;

export default mongoose.model("Post", postSchema);
