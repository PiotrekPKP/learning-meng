import { ArgsDictionary, AuthChecker } from "type-graphql";
import { GraphQLResolveInfo } from "graphql";
import jwt from "jsonwebtoken";
import { SECRET } from "../../config";

export const authChecker: AuthChecker = ({ context }: { root, args: ArgsDictionary, context: any, info: GraphQLResolveInfo }) => {
    const authorization = context.req.headers.authorization;
    if(authorization) {
        const token = authorization.split("Bearer ")[1]
        if(token) {
            try {
                context.user = jwt.verify(token, SECRET);
                return jwt.verify(token, SECRET);
            }
            catch (e) { return false; }
        }
        return false;
    }
    return false;
}