import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Post } from "src/posts/post.model";

@ObjectType()
export class Link {
  @Field()
  id: string;

  @Field()
  prevPostId: string;
  
  @Field(() => Post)
  prevPost: Post;

  @Field()
  nextPostId: string;

  @Field(() => Post)
  nextPost: Post;

  @Field(() => Int)
  upvotes: number;

  @Field()
  createDate: Date;

  @Field()
  updateDate: Date;
 
  @Field({ nullable: true })
  deleteDate: Date;
}
