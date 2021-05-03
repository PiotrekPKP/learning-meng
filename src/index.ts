import 'reflect-metadata';
import { ApolloServer, ServerInfo, UserInputError } from 'apollo-server';
import mongoose, { Mongoose } from "mongoose";

import { MONGODB } from "../config";
import { authChecker } from "./utils/auth.checker";
import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";

import PostResolver from "./resolvers/post.resolver";
import UserResolver from "./resolvers/user.resolver";
import CommentResolver from "./resolvers/comment.resolver";

mongoose.connect(MONGODB,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then((r: Mongoose) => {
        console.log(`MongoDB (${ r.connection.name }) connected!`);
        return buildSchema({
            resolvers: [PostResolver, UserResolver, CommentResolver],
            emitSchemaFile: true,
            authChecker
        });
    })
    .then((schema: GraphQLSchema) => {
        const server = new ApolloServer({
            schema,
            formatError: (error) => {
                let errorStack: string[] = [];
                if(error.extensions.exception.validationErrors) { error.extensions.exception.validationErrors.forEach(validationError => errorStack.push(validationError.constraints[Object.keys(validationError.constraints)[0]])) }
                else { errorStack = error.extensions.errors }

                return new UserInputError(error.originalError.message, {
                    errors: errorStack
                })
            },
            context: ({ req }) => ({ req })
        });
        return server.listen({ port: 5000 });
    })
    .then((res: ServerInfo) => {
        console.log(`Server running at ${ res.url }!`)
    });
