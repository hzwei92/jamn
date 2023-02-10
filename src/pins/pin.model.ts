import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Post } from "src/posts/post.model";

@ObjectType()
export class Pin {
  @Field()
  id: string;

  @Field()
  rootPostId: string;

  @Field(() => Post)
  rootPost: Post;

  @Field()
  leafPostId: string;

  @Field(() => Post)
  leafPost: Post;

  @Field(() => Int)
  upvotes: number;

  @Field()
  createDate: Date;

  @Field()
  updateDate: Date;
 
  @Field({ nullable: true })
  deleteDate: Date;
}
