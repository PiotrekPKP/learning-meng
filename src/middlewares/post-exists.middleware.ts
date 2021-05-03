import { UserInputError } from "apollo-server";
import { MiddlewareInterface, NextFn } from "type-graphql";
import { PostModel } from "../models/Post";

export default class PostExistsMiddleware implements MiddlewareInterface {
    async use({ args, context }: { args: any, context: any }, next: NextFn) {
        const postId = args.postId || args.comment.postId;
        const post: any = await PostModel.findById(postId);
        if(!post) throw new UserInputError("Post error", { errors: [ "Could not find post!" ] });

        context.post = post;
        return next();
    }
}