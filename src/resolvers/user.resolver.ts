import { Arg, Mutation, Resolver } from 'type-graphql'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { UserInputError } from "apollo-server";

import { SECRET } from "../../config";
import { RegisterInput } from "./types/register.input";
import { User, UserModel } from "../models/User";
import { LoginInput } from "./types/login.input";

@Resolver(() => User)
export default class UserResolver {
    @Mutation(() => User)
    async register(@Arg("register") { username, email, password, confirmPassword }: RegisterInput): Promise<User> {
        if(password !== confirmPassword) throw new UserInputError("User validation error", { errors: [ "Passwords do not match!" ] })

        const user_ = await UserModel.findOne({ username })
        if(user_) throw new UserInputError("User validation error", { errors: [ "This username is taken!" ] })

        password = await bcrypt.hash(password, 12);

        const newUser = new UserModel({ email, username, password, createdAt: new Date() })

        const user: any = await newUser.save();
        const token = this.token(user);

        return { ...user._doc, id: user._id, token }
    }

    @Mutation(() => User)
    async login(@Arg("login") { username, password }: LoginInput): Promise<User> {
        const user: any = await UserModel.findOne({ username });
        if(!user) throw new UserInputError('Login error', { errors: [ "User does not exist!" ] })

        const match = await bcrypt.compare(password, user.password);
        if(!match) throw new UserInputError('Login error', { errors: [ "Wrong password!" ] })

        const token = this.token(user);

        return { ...user._doc, id: user._id, token }
    }

    token = user => jwt.sign({ id: user.id, email: user.email, username: user.username }, SECRET, { expiresIn: '1h' })
}