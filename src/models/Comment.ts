import {getModelForClass, prop } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class Comment {
    @Field(() => ID)
    readonly _id: ObjectId

    @prop()
    @Field()
    body: string

    @prop()
    @Field()
    username: string

    @prop()
    @Field()
    createdAt: Date
}

export const CommentModel = getModelForClass(Comment);