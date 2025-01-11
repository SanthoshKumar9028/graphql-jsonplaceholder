import mongoose from "mongoose";

export const connectMongoDB = () => {
  return mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME,
  });
};
