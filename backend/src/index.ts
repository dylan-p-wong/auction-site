import { ApolloServer } from "apollo-server-express";
import { PubSub } from 'graphql-subscriptions';
import express from "express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { createConnection, getConnection, getRepository } from "typeorm";
import { UserResolver } from "./resolver/user";
import session from "express-session";
import { CardResolver } from "./resolver/card";
import { AuctionResolver } from "./resolver/auction";
import http from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from 'graphql';
import { Auction } from "./entity/Auction";
import { Card } from "./entity/Card";
import { User } from "./entity/User";
import cors from "cors";

const main = async () => {
    const conn = await createConnection();    
    const app = express();
    //await getRepository(Auction).delete({});
    //await getRepository(User).delete({});
    //await getRepository(Card).delete({});

    app.set('trust proxy', 1);
    
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true
        })
    );

    app.use(session({
        name: 'qid',
        secret: 'asdfasdf',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            sameSite: "lax",
        }
    }));

    const httpServer = http.createServer(app);

    //const pubsub = new PubSub();

    const schema = await buildSchema({
        resolvers: [UserResolver, CardResolver, AuctionResolver]
    });

    const apolloServer = new ApolloServer({
        schema: schema,
        context: ({req, res}) => ({
            req, res
        })
    });
    apolloServer.applyMiddleware({app, cors: false});

    apolloServer.installSubscriptionHandlers(httpServer);

    const PORT = process.env.PORT || 4000;

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`)
    });
}

main().catch((err)=>{
    console.error(err);
});


