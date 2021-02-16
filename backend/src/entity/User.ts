import { ObjectType, Field }  from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import { Auction } from "./Auction";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class User {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unique: true })
    username!: string;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Field()
    @Column()
    coins!: number;

    @Column()
    password!: string;
    
    @Field(() => [Card])
    @OneToMany(() => Card, card => card.user, { cascade: true })
    cards: Card[];

    @Field(() => [Auction])
    @ManyToMany(() => Auction)
    @JoinTable()
    auctions: Auction[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
