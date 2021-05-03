import { Field, InputType } from "type-graphql";
import { User } from "../../models/User";
import { IsEmail, Length } from "class-validator";

@InputType()
export class RegisterInput implements Partial<User> {
    @Field()
    @Length(3)
    username: string

    @Field()
    @Length(8)
    password: string

    @Field()
    confirmPassword: string

    @Field()
    @IsEmail()
    email: string
}