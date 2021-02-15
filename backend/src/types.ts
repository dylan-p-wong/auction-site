import { Request, Response } from "express";
import { PubSub } from "type-graphql";

declare module "express-session" {
    interface Session {
      userId: string;
    }
}

export type Context = {
    req: Request,
    res: Response,
    pubsub: typeof PubSub
}
