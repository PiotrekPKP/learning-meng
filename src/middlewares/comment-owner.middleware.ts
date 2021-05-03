import { AuthenticationError } from "apollo-server";
import { MiddlewareInterface, NextFn } from "type-graphql";

export default class CommentOwnerMiddleware implements MiddlewareInterface {
    async use({ args, context }: { args: any, context: any }, next: NextFn) {
        if(context.comment.username !== context.user.username) throw new AuthenticationError("You are not the comment owner!");

        return next();
    }
}