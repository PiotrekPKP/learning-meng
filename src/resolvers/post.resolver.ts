import {
    Arg,
    Authorized,
    Ctx,
    FieldResolver,
    Mutation,
    PubSub,
    PubSubEngine,
    Query,
    Resolver,
    Root, Subscription,
    UseMiddleware
} from 'type-graphql'
import { Post, PostModel, PostSubscription } from "../models/Post";
import { ObjectId } from "mongodb";
import ObjectIdScalar from "../object-id.scalar";
import { PostInput } from "./types/post.input";
import PostOwnerMiddleware from "../middlewares/post-owner.middleware";
import PostExistsMiddleware from "../middlewares/post-exists.middleware";
import { User, UserModel } from "../models/User";
import {UserInputError} from "apollo-server-express";

@Resolver(() => Post)
export default class PostResolver {
    @Query(() => [Post], { nullable: true })
    async posts(): Promise<Post[]> {
        return PostModel.find().sort({ createdAt: -1 });
    }

    @UseMiddleware(PostExistsMiddleware)
    @Query(() => Post)
    async post(@Arg("postId", () => ObjectIdScalar) id: ObjectId, @Ctx() context): Promise<Post> {
        return context.post;
    }

    @Authorized()
    @Mutation(() => Post)
    async addPost(@Arg("post") { body }: PostInput, @Ctx() context, @PubSub() pubsub: PubSubEngine): Promise<Post> {
        const post: any = await new PostModel({ body, createdAt: new Date(), user: context.user.id }).save();
        await pubsub.publish("POSTS", { ...post, action: "ADD" });
        return post;
    }

    @Authorized()
    @UseMiddleware(PostExistsMiddleware, PostOwnerMiddleware)
    @Mutation(() => Post)
    async deletePost(@Arg("postId", () => ObjectIdScalar) id: ObjectId, @Ctx() context, @PubSub() pubsub: PubSubEngine): Promise<Post> {
        await pubsub.publish("POSTS", { ...context.post, action: "DELETE" });
        return await context.post.delete();
    }

    @Authorized()
    @UseMiddleware(PostExistsMiddleware)
    @Mutation(() => Post)
    async likePost(@Arg("postId", () => ObjectIdScalar) id: ObjectId, @Ctx() context): Promise<Post> {
        const userLikesPost = context.post.likes.filter(like => like.username === context.user.username)[0];
        if(userLikesPost) context.post.likes = context.post.likes.filter(like => like.username !== context.user.username);
        else context.post.likes.push({ username: context.user.username, createdAt: new Date(), _id: new ObjectId() })
        return await context.post.save();
    }

    @Subscription({ topics: "POSTS" })
    postsUpdate(@Root() post: Post | any): PostSubscription {
        const user = UserModel.findById(post._doc.user);
        if(!user) throw new UserInputError("Post error", { errors: [ "There is no given user!" ] })
        return { ...post._doc, action: post.action, user };
    }

    @FieldResolver()
    async user(@Root() post: Post | any): Promise<User> {
        return (await UserModel.findById(post._doc.user))!;
    }
}