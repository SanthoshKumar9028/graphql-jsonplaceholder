import User from "../../models/User";

export const getUsers = async () => {
  const users = await User.find().populate("posts");
  return users;
};

export const getUserById = async (parent, args) => {
  const user = await User.findById(args.id).populate("posts");
  return user;
};

export const createUser = async (parent, args) => {
  const user = new User(args.payload);
  await user.save();
  return user;
};

export const updateUser = async (parent, args) => {
  const user = await User.findByIdAndUpdate(args.id, args.payload, {
    new: true,
  }).populate("posts");
  return user;
};

export const deleteUserById = async (parent, args) => {
  const user = await User.findByIdAndDelete(args.id).populate("posts");
  return user;
};

export default {
  query: {
    users: getUsers,
    getUserById,
  },
  mutation: {
    createUser,
    updateUser,
    deleteUserById,
  },
};
