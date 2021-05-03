import { Field, InputType } from "type-graphql";
import { User } from "../../models/User";
import { IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class LoginInput implements Partial<User> {
    @Field()
    @IsNotEmpty()
    username: string

    @Field()
    @IsNotEmpty()
    password: string
}