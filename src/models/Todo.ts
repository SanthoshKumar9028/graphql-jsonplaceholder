import mongoose, { Schema } from "mongoose";

const loadedAtPlugin = (schema: Schema, options: any) => {
  schema.virtual("loadedAt", {
    get() {
      return this.loadedAt;
    },
    set(v: any) {
      this.loadedAt = v;
    },
  });

  schema.post(["find", "findOne"], function (result) {
    if (!Array.isArray(result)) {
      result = [result];
    }

    const data = Date.now();

    for (let doc of result) {
      doc.loadedAt = data;
    }
  });
};

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "CANCELED", "COMPLETED"],
    required: true,
    default: "PENDING",
  },
  userId: Schema.ObjectId,
});

todoSchema.plugin(loadedAtPlugin);

export const todoTypeDef = `
  enum TodoStatus {
    PENDING
    CANCELED
    COMPLETED
  }

  scalar Date
  
  type Todo {
    id: ID!
    title: String!
    status: TodoStatus!
    userId: ID!
    loadedAt: Date
  }
`;

export default mongoose.model("Todo", todoSchema);
