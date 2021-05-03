import { AuthenticationError } from "apollo-server";
import { MiddlewareInterface, NextFn } from "type-graphql";

export default class PostOwnerMiddleware implements MiddlewareInterface {
    async use({ args, context }: { args: any, context: any }, next: NextFn) {
        if(context.post.user.toHexString() !== context.user.id) throw new AuthenticationError("You are not the post owner!");

        return next();
    }
}