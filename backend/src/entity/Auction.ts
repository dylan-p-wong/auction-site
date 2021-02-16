import { timeStamp } from "console";
import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Timestamp, OneToMany } from "typeorm";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class Auction extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Card)
    @ManyToOne(() => Card, card => card.auctions)
    @JoinColumn()
    card: Card;

    @Field()
    @Column()
    startingBid: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    currentBid?: number;

    @Field({nullable: true})
    @Column({ nullable: true })
    leaderId?: number;

    @Field()
    @Column()
    ownerId: number;

    @Field()
    @Column()
    itemClaimed: boolean; 

    @Field()
    @Column()
    coinsClaimed: boolean; 

    @Field(() => Date)
    @Column({type: "timestamp"})
    endTime!: Date;

    @Field(() => String)
    @CreateDateColumn({type: "timestamp"})
    auctionStart: Date;

    @Field(() => String)
    @UpdateDateColumn({type: "timestamp"})
    updatedAt: Date;
}