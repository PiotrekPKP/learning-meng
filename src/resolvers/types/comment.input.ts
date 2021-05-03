import { Field, ID, InputType } from "type-graphql";
import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongodb";
import { Comment } from "../../models/Comment";

@InputType()
export class CommentAddInput implements Partial<Comment> {
    @Field(() => ID)
    @IsNotEmpty()
    postId: ObjectId

    @Field()
    @IsNotEmpty()
    body: string
}

@InputType()
export class CommentDeleteInput {
    @Field(() => ID)
    @IsNotEmpty()
    postId: ObjectId

    @Field(() => ID)
    @IsNotEmpty()
    commentId: ObjectId
}