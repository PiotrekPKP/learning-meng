import { Field, InputType } from "type-graphql";
import { IsNotEmpty } from "class-validator";
import { Post } from "../../models/Post";

@InputType()
export class PostInput implements Partial<Post> {
    @Field()
    @IsNotEmpty()
    body: string
}