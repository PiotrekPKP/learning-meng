import { buildSchema } from "type-graphql";
import PostResolver from "../resolvers/post.resolver";
import UserResolver from "../resolvers/user.resolver";
import CommentResolver from "../resolvers/comment.resolver";
import { authChecker } from "./auth.checker";
import { UserInputError } from "apollo-server-express";
import { GraphQLError } from "graphql";

export const createSchema = () => buildSchema({
    resolvers: [PostResolver, UserResolver, CommentResolver],
    emitSchemaFile: true,
    authChecker
});

export const errorFormatting = (error: GraphQLError) => {
    let errorStack: string[] = [];
    if(error.extensions.exception.validationErrors) { error.extensions.exception.validationErrors
        .forEach(validationError => errorStack.push(validationError.constraints[Object.keys(validationError.constraints)[0]])) }
    else { errorStack = error.extensions.errors }
    return new UserInputError(error.originalError.message, { errors: errorStack })
}

export const getContext = ({ req }) => {
    return ({ req });
}