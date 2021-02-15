import { ObjectType, Field }  from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
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

    @Column()
    password!: string;
    
    @Field(() => [Card])
    @OneToMany(() => Card, card => card.user, { cascade: true })
    cards: Card[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
