import { prop } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export default class Like {
    @Field(() => ID)
    readonly _id: ObjectId

    @prop()
    @Field()
    username: string

    @prop()
    @Field()
    createdAt: Date
}
