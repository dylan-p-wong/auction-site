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
    @OneToOne(() => Card, {onDelete: 'CASCADE'})
    @JoinColumn()
    card: Card;

    @Field()
    @Column()
    startingBid: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    currentBid?: Number;

    @Field({nullable: true})
    @Column({ nullable: true })
    leaderId?: number;

    @Field()
    @Column()
    claimed: boolean; 

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