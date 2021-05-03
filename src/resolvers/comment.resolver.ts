import { Arg, Authorized, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Comment } from "../models/Comment";
import PostExistsMiddleware from "../middlewares/post-exists.middleware";
import { CommentAddInput, CommentDeleteInput } from "./types/comment.input";
import CommentExistsMiddleware from "../middlewares/comment-exists.middleware";
import { Post } from "../models/Post";
import CommentOwnerMiddleware from "../middlewares/comment-owner.middleware";
import { ObjectId } from "mongodb";

@Resolver(() => Comment)
export default class CommentResolver {
    @Authorized()
    @UseMiddleware(PostExistsMiddleware)
    @Mutation(() => Post)
    async addComment(@Arg("comment") { postId, body }: CommentAddInput, @Ctx() context): Promise<Post> {
        context.post.comments.unshift({ body, username: context.user.username, createdAt: new Date(), _id: new ObjectId() })
        return await context.post.save();
    }

    @Authorized()
    @UseMiddleware(PostExistsMiddleware, CommentExistsMiddleware, CommentOwnerMiddleware)
    @Mutation(() => Post)
    async deleteComment(@Arg("comment") { postId, commentId }: CommentDeleteInput, @Ctx() context): Promise<Post> {
        context.post.comments = context.post.comments.filter(comment => comment._id.toHexString() !== commentId);
        return await context.post.save();
    }
}
