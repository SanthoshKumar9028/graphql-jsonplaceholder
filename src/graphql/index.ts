import { postTypeDef } from "../models/Post";
import { userTypeDef } from "../models/User";
import { todoTypeDef } from "../models/Todo";
import postsResolvers from "./resolvers/posts";
import userResolvers from "./resolvers/users";
import todosResolvers from "./resolvers/todos";

const queryTypeDef = `
  type Query {
    posts: [Post]
    getPostById(id: ID!): Post
    
    users: [User]
    getUserById(id: ID!): User

    getPostComments(id: ID!): [Comment]

    todos(userId: ID): [Todo]
    getTodoById(id: ID!): Todo
  }

  input CreatePostInput {
    userId: ID!
    title: String!
    content: String!
  }
  
  input UpdatePostInput {
    title: String
    content: String
  }

  input CreateUserInput {
    username: String!
    email: String!
  }

  input UpdateUserInput {
    email: String
  }

  input CreateCommentInput {
    postId: ID!
    content: String!
    userId: ID!
    userName: String!
  }

  input UpdateTodoInput {
    title: String
    status: TodoStatus
  }

  type Mutation {
    createPost(payload: CreatePostInput!): Post
    updatePost(id: ID!, payload: UpdatePostInput!): Post
    deletePostById(id: ID!): Post

    addCommentInPost(payload: CreateCommentInput!): Comment!

    createUser(payload: CreateUserInput!): User
    updateUser(id: ID!, payload: UpdateUserInput!): User
    deleteUserById(id: ID!): User

    addTodo(userId: ID!, title: String!): Todo
    updateTodo(id: ID!, payload: UpdateTodoInput!): Todo
    deleteTodoById(id: ID!): Todo
  }
`;

export const typeDefs = [queryTypeDef, postTypeDef, userTypeDef, todoTypeDef];

export const resolvers = {
  Query: {
    ...postsResolvers.query,
    ...userResolvers.query,
    ...todosResolvers.query,
  },
  Mutation: {
    ...postsResolvers.mutation,
    ...userResolvers.mutation,
    ...todosResolvers.mutation,
  },
};
