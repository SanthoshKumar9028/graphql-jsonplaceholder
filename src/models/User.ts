import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

export const userTypeDef = `
  type User {
    id: ID!
    username: String!
    email: String!
    posts: [Post]
  }
`;

export default mongoose.model("User", userSchema);
