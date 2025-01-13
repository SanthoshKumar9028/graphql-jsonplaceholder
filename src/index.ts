import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";
import { connectMongoDB } from "./utils/dp";
import { resolvers, typeDefs } from "./graphql";
import { GLContext } from "./graphql/types";

const app = express();
const httpServer = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const webSocketServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const pubsub = new PubSub();

const serverCleanup = useServer(
  {
    schema,
    context: (ctx) => {
      ctx["pubsub"] = pubsub;
      return ctx;
    },
  },
  webSocketServer
);

const apolloServer = new ApolloServer<GLContext>({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            return await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

const PORT = process.env.PORT || 3636;

connectMongoDB()
  .then(() => {
    console.log("Connected to MongoDB");
    return apolloServer.start();
  })
  .then(() => {
    console.log("Connected Apollo Server");

    app.use(
      "/graphql",
      expressMiddleware(apolloServer, {
        async context() {
          return { pubsub };
        },
      })
    );

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
