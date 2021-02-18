require('dotenv').config()
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
import path from "path";

const config:any = {
    "type": "postgres",
    "url": process.env.DATABASE_URL,
    "synchronize": true,
    "logging": false,
    "entities": ["dist/entity/*.js"],
    "migrations": [path.join(__dirname, "./migration/*")]
}

const main = async () => {
    const conn = await createConnection(config);    

    const app = express();
    //await getRepository(Auction).delete({});
    //await getRepository(User).delete({});
    //await getRepository(Card).delete({});

    app.set('trust proxy', 1);
    
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true
        })
    );

    app.use(session({
        name: 'qid',
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { 
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            domain: process.env.NODE_ENV === "production" ? ".auctionhouse.shop" : undefined
        }
    }));

    const httpServer = http.createServer(app);

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

    httpServer.listen(parseInt(process.env.PORT), () => {
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`)
        console.log(`🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`)
    });
}

main().catch((err)=>{
    console.error(err);
});


