import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Auction } from "./Auction";
import { User } from "./User";

@ObjectType()
@Entity()
export class Card extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(()=> String)
    @Column()
    name!: string;

    @Field()
    @Column()
    description!: string;

    @Field(() => User)
    @ManyToOne(()=> User, user => user.cards)
    user: User;

    @Field(() => Auction)
    @OneToMany(() => Auction, auction => auction.card)
    auctions: Auction[];

    @Field(() => Number, {nullable: true})
    @Column({nullable: true})
    auctionId: Number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}