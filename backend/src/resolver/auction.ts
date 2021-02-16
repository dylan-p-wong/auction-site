import { isAuth } from "../middleware/isAuth";
import { Arg, Ctx, Field, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver, Root, Subscription, UseMiddleware } from "type-graphql";
import { Auction } from "../entity/Auction";
import { Card } from "../entity/Card";
import { getRepository, Timestamp } from "typeorm";
import { FieldError } from "./fieldError";
import { Context } from "../types";
import { timeLeftMS } from "../helpers/dateHelpers";
import { User } from "../entity/User";

@ObjectType()
class AuctionResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => Auction, {nullable: true})
    auction?: Auction
}

@Resolver(Auction)
export class AuctionResolver {
    @Subscription(() => Auction, {
        topics: ({ args }) => "BID-" + args.auctionId
    })
    async newBid(@Arg("auctionId") auctionId: number): Promise<Auction> {
        return await getRepository(Auction).findOne(auctionId);
    }

    @Query(() => [Auction])
    async getAuctions(){
        const auctions = await getRepository(Auction).find({relations: ["card"]});
        return auctions;
    }

    @Query(() => AuctionResponse)
    async getAuction(
        @Arg("auctionId") auctionId: number,
    ){
        const auction = await getRepository(Auction).findOne({where: {id: auctionId}, relations: ["card"]});
        if (!auction){
            return { errors: [
                {
                    field: "auctionId",
                    message: "No auction exists with this Id"
                }
            ]}
        }
        
        return { auction };
    }
    
    @Mutation(()=> AuctionResponse)
    @UseMiddleware(isAuth)
    async createAuction(
        @Arg("cardId") cardId: number,
        @Arg("length") length: number,
        @Arg("startingBid") startingBid: number,
        @Ctx() { req }: Context
    ){
        const card = await getRepository(Card).findOne({where: {id: cardId}, relations: ["user"]});

        if (!card){
            return { errors: [
                {
                    field: "cardId",
                    message: "No card exists with this Id"
                }
            ]}
        }

        if (card.auctions && card.auctions.length > 0 && card[card.auctions.length - 1]){
            return { errors: [
                {
                    field: "",
                    message: "Card is already listed"
                }
            ]}
        }

        if (card.user.id !== parseInt(req.session.userId)){
            return { errors: [
                {
                    field: "",
                    message: "You do not own this card"
                }
            ]}
        }

        const newAuction = new Auction();
        newAuction.card = card;
        newAuction.ownerId = parseInt(req.session.userId);
        const now = new Date();
        newAuction.endTime = new Date(now.getTime() + length * 60 * 1000);
        newAuction.startingBid = startingBid;
        newAuction.itemClaimed = false;
        newAuction.coinsClaimed = false;
        await getRepository(Auction).save(newAuction);

        card.auctionId = newAuction.id;
        await getRepository(Card).save(card);

        const user = await getRepository(User).findOne({where: {id: req.session.userId}, relations: ["auctions"]});
        user.auctions.push(newAuction);
        await getRepository(User).save(user);

        return { auction: newAuction };
    }

    @Mutation(()=>AuctionResponse)
    @UseMiddleware(isAuth)
    async bid(
        @Arg("auctionId") auctionId: number,
        @Arg("bid") bid: number,
        @Ctx() { req }: Context,
        @PubSub() pubsub: PubSubEngine,
    ){
        const auction = await getRepository(Auction).findOne(auctionId);
        
        if (!auction){
            return { errors: [
                {
                    field: "",
                    message: "This auction does not exist"
                }
            ]}
        }

        if (auction.ownerId === parseInt(req.session.userId)){
            return { errors: [
                {
                    field: "",
                    message: "You can not bid on your own auction"
                }
            ]}
        }

        if (auction.leaderId === parseInt(req.session.userId)){
            return { errors: [
                {
                    field: "",
                    message: "You do not want to outbid yourself"
                }
            ]}
        }

        if (timeLeftMS(new Date(), auction.endTime) < 10) {
            return { errors: [
                {
                    field: "bid",
                    message: "Auction is over"
                }
            ]}
        }

        if (bid <= auction.startingBid || (auction.currentBid && bid <= auction.currentBid)){
            return { errors: [
                {
                    field: "bid",
                    message: "Please increase your bid"
                }
            ]}
        }

        auction.currentBid = bid;
        auction.leaderId = parseInt(req.session.userId);
        await getRepository(Auction).save(auction);

        const user = await getRepository(User).findOne({where: {id: req.session.userId}, relations: ["auctions"]});
        user.auctions.push(auction);
        await getRepository(User).save(user);

        await pubsub.publish(`BID-${auctionId}`, {});

        return { auction: auction };
    }

    @Mutation(()=>AuctionResponse)
    @UseMiddleware(isAuth)
    async claimCoins(
        @Arg("auctionId") auctionId: number,
        @Ctx() { req }: Context
    ){
        const auction = await getRepository(Auction).findOne({where: {id: auctionId}, relations: ["card"]});

        if (!auction){
            return { errors: [
                {
                    field: "",
                    message: "This auction does not exist"
                }
            ]}
        }

        if (timeLeftMS(new Date(), auction.endTime) > 0) {
            return { errors: [
                {
                    field: "",
                    message: "This auction is not over"
                }
            ]}
        }

        if (auction.coinsClaimed){
            return { errors: [
                {
                    field: "",
                    message: "Auction claimed already"
                }
            ]}
        }

        if (auction.ownerId !== parseInt(req.session.userId)){
            return { errors: [
                {
                    field: "",
                    message: "You did not run this auction"
                }
            ]}
        }

        const user = await getRepository(User).findOne(req.session.userId);
        user.coins = user.coins + auction.currentBid;
        await getRepository(User).save(user);
        auction.coinsClaimed = true;
        await getRepository(Auction).save(auction);

        if (!auction.currentBid || !auction.leaderId){
            auction.itemClaimed = true;
            const card = await getRepository(Card).findOne({where: {id: auction.card.id}, relations: ["user"]});
            card.auctionId = null;
            await getRepository(Card).save(card);
        }

        return { auction };
    }

    @Mutation(()=>AuctionResponse)
    @UseMiddleware(isAuth)
    async claim(
        @Arg("auctionId") auctionId: number,
        @Ctx() { req }: Context
    ){
        const auction = await getRepository(Auction).findOne({where: {id: auctionId}, relations: ["card"]});

        if (!auction){
            return { errors: [
                {
                    field: "",
                    message: "This auction does not exist"
                }
            ]}
        }

        if (timeLeftMS(new Date(), auction.endTime) > 0) {
            return { errors: [
                {
                    field: "",
                    message: "This auction is not over"
                }
            ]}
        }

        if (auction.itemClaimed){
            return { errors: [
                {
                    field: "",
                    message: "Auction claimed already"
                }
            ]}
        }

        if ((auction.ownerId !== parseInt(req.session.userId) && auction.leaderId == null) && auction.leaderId !== parseInt(req.session.userId)){
            return { errors: [
                {
                    field: "",
                    message: "This is not yours to claim"
                }
            ]}
        }

        auction.itemClaimed = true;
        await getRepository(Auction).save(auction);

        const card = await getRepository(Card).findOne({where: {id: auction.card.id}, relations: ["user"]});
        
        if (auction.leaderId === parseInt(req.session.userId)){
            card.user = await getRepository(User).findOne(req.session.userId);
        }

        card.auctionId = null;
        await getRepository(Card).save(card);

        return { auction };
    }
}