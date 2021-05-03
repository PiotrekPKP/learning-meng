import { UserInputError } from "apollo-server";
import { MiddlewareInterface, NextFn } from "type-graphql";
import { CommentModel } from "../models/Comment";
import {PostModel} from "../models/Post";

export default class CommentExistsMiddleware implements MiddlewareInterface {
    async use({ args, context }: { args: any, context: any }, next: NextFn) {
        const commentId = args.commentId || args.comment.commentId;
        const post: any = await PostModel.findById(args.postId || args.comment.postId);
        const comment = post.comments.filter(comment_ => comment_._id.toHexString() === commentId)[0]
        if(!comment) throw new UserInputError("Comment error", { errors: [ "Could not find comment!" ] });

        context.comment = comment;
        return next();
    }
}