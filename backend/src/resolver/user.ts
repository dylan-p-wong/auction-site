import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, PubSub } from "type-graphql";
import { User } from "../entity/User";
import * as argon2 from "argon2";
import { getRepository } from "typeorm";
import { Context } from "../types";
import { FieldError } from "./fieldError";

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver(User)
export class UserResolver {

    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { req }: Context,
    ){
        if (!req.session.userId) {
            return null;
        }
        const user = await getRepository(User).findOne({where: {id: req.session.userId}, relations: ["cards"]});
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("email") email: string,
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() { req }: Context
    ): Promise<UserResponse> {
        const foundUser = await getRepository(User).findOne({
            where: [
                { email: email },
                { username: username }
            ]
        });
        
        if (foundUser?.email === email){
            return { errors: [
                {
                    field: "email",
                    message: "email is taken"
                }
            ]}
        }
        if (foundUser?.username === username){
            return { errors: [
                {
                    field: "username",
                    message: "username is taken"
                }
            ]}
        }

        const hashedPassword = await argon2.hash(password);

        const user = new User();
        user.email = email;
        user.username = username;
        user.password = hashedPassword;
        user.cards = [];

        await getRepository(User).save(user); 

        req.session.userId = (user.id).toString();
        
        return { user }; 
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { req }: Context
    ): Promise<UserResponse> {
        const user = await getRepository(User).findOne({
            where: { email },
        });

        if (!user){
            return {
                errors: [{
                    field: "email",
                    message: "email does not exist"
                }]
            }
        }

        const valid = await argon2.verify(user.password, password);

        if (!valid){
            return {
                errors: [{
                    field: "password",
                    message: "Incorrect password"
                }]
            }
        }

        req.session.userId = (user.id).toString();
        
        return { user }; 
    }

    @Mutation(() => Boolean)
    async logout(
        @Ctx() { req, res }: Context
    ) {
        res.clearCookie('qid');
        return new Promise(resolve => {
            req.session.destroy((err)=>{
                if (err){
                    resolve(false);
                } 
    
                resolve(true);
            });
        });
    }
}


