import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { connectMongoDB } from "./utils/dp";
import { resolvers, typeDefs } from "./graphql";

const app = express();
const httpServer = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const PORT = process.env.PORT || 3636;

connectMongoDB()
  .then(() => {
    console.log("Connected to MongoDB");
    return apolloServer.start();
  })
  .then(() => {
    console.log("Connected Apollo Server");

    app.use("/graphql", expressMiddleware(apolloServer));

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
