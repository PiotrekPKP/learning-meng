import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from "type-graphql";
import { Comment } from "./Comment";
import Like from "./Like";
import { User } from "./User";
import { ObjectId } from "mongodb";

@ObjectType()
export class PostSubscription {
    @Field(() => ID)
    readonly _id: ObjectId;

    @Field()
    body: string

    @Field()
    createdAt: Date

    @Field(() => [Comment], { nullable: true })
    comments: Comment[]

    @Field(() => [Like], { nullable: true })
    likes: Like[]

    @Field()
    action: string;
}

@ObjectType()
export class Post {
    @Field(() => ID)
    readonly _id: ObjectId;

    @prop()
    @Field()
    body: string

    @prop()
    @Field()
    createdAt: Date

    @prop()
    @Field(() => [Comment], { nullable: true })
    comments: Comment[]

    @prop()
    @Field(() => [Like], { nullable: true })
    likes: Like[]

    @prop({ ref: User })
    @Field(() => User)
    user: Ref<User>
}

export const PostModel = getModelForClass(Post);
