import Todo from "../../models/Todo";

export const getTodos = async (parent, args) => {
  let query = {};

  if (args.userId) {
    query = { userId: args.userId };
  }

  const todos = await Todo.find(query);

  return todos;
};

export const getTodoById = async (parent, args) => {
  const todos = await Todo.findById(args.id);

  return todos;
};

export const addTodo = async (parent, args) => {
  const todo = new Todo({
    title: args.title,
    userId: args.userId,
  });

  await todo.save();

  return todo;
};

export const updateTodo = async (parent, args) => {
  console.log("updateTodo", args);

  const todo = await Todo.findByIdAndUpdate(args.id, args.payload, {
    new: true,
  });

  return todo;
};

export const deleteTodoById = async (parent, args) => {
  const todo = await Todo.findByIdAndDelete(args.id);

  return todo;
};

export default {
  query: {
    todos: getTodos,
    getTodoById,
  },
  mutation: {
    addTodo,
    updateTodo,
    deleteTodoById,
  },
};
