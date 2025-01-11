# GraphQL JSONPlaceholder

This project is a GraphQL wrapper for the JSONPlaceholder API, providing a GraphQL interface to interact with the JSONPlaceholder endpoints.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Installation

To install the dependencies, run the following command:

```bash
npm install
```

## Usage

All the data is stored in the MongoDB database. These are the below env variables need to configure before running the server.

```bash
MONGODB_URI=YOUR_MONGODB_SERVER_URI
MONGODB_DB_NAME=YOUR_MONGODB_DATABASE_NAME
```

To start the server, use the following command:

```bash
npm run dev
```

The GraphQL server will be running at `http://localhost:3636/graphql`.

To build the project for production, use the following command:

```bash
npm run build
npm run start
```

Production code will be availble in dist folder in root.

## API Endpoints

The following JSONPlaceholder endpoints are available through the GraphQL interface:

### GraphQL Resolvers for managing posts.

This module provides the following resolvers:

Query Resolvers:

- `posts`: Retrieves all posts.
- `getPostById`: Retrieves a single post by its ID.

Mutation Resolvers:

- `createPost`: Creates a new post and associates it with a user.
- `updatePost`: Updates an existing post by its ID.
- `deletePostById`: Deletes a post by its ID.

Each resolver interacts with the Post and User models to perform the necessary database operations.

### GraphQL Resolvers for User operations.

This module provides the following resolvers for User operations:

Queries:

- `users`: Fetches all users along with their associated posts.
- `getUserById`: Fetches a single user by ID along with their associated posts.

Mutations:

- `createUser`: Creates a new user with the provided payload.
- `updateUser`: Updates an existing user by ID with the provided payload.
- `deleteUserById`: Deletes a user by ID and returns the deleted user.

Each resolver interacts with the User model and populates the "posts" field.

### GraphQL Resolvers for managing comments.

This module provides the following resolvers for managing comments within posts:

Query Resolvers:

- `getPostComments`: Retrieves all comments for a specific post by its ID.

Mutation Resolvers:

- `addCommentInPost`: Adds a new comment to a specific post.

Each resolver interacts with the Post model to perform the necessary database operations related to comments.

### GraphQL Resolvers for managing todos.

This module provides the following resolvers for managing todos:

Query Resolvers:

- `todos`: Retrieves all todos, optionally filtered by userId.
- `getTodoById`: Retrieves a single todo by its ID.

Mutation Resolvers:

- `addTodo`: Creates a new todo with the provided title and userId.
- `updateTodo`: Updates an existing todo by its ID with the provided payload.
- `deleteTodoById`: Deletes a todo by its ID.

Each resolver interacts with the Todo model to perform the necessary database operations.

