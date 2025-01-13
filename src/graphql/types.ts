import { PubSub } from "graphql-subscriptions";

export enum PubSubTriggers {
  POST_CREATED = "POST_CREATED",
  POST_METRICS = "POST_METRICS",
}

export interface GLContext {
  pubsub: PubSub;
}
