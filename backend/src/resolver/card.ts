import { Card } from "../entity/Card";
import { isAuth } from "../middleware/isAuth";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { getRepository } from "typeorm";
import { Context } from "../types";
import { User } from "../entity/User";
import { FieldError } from "./fieldError";

@ObjectType()
class CardResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => Card, {nullable: true})
    card?: Card
}

@Resolver(Card)
export class CardResolver {
    @Query(() => [Card])
    async getCards(){
        const cards = await getRepository(Card).find({relations: ["user"]});
        return cards;
    }

    @Mutation(() => CardResponse)
    @UseMiddleware(isAuth)
    async createCard(
        @Arg("name") name: string,
        @Arg("description") description: string,
        @Ctx() { req }: Context
    ){
        const newCard = new Card();
        newCard.name = name;
        newCard.description = description;

        newCard.user = await getRepository(User).findOne(req.session.userId);

        await getRepository(Card).save(newCard);

        return { card: newCard };
    }
}


