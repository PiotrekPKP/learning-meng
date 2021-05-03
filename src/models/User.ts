import { getModelForClass, prop } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class User {
    @Field(() => ID)
    readonly _id: ObjectId

    @prop()
    @Field()
    username: string

    @prop()
    @Field()
    password: string

    @prop()
    @Field()
    email: string

    @prop()
    @Field()
    createdAt: Date

    @prop()
    @Field()
    token: string
}

export const UserModel = getModelForClass(User);
