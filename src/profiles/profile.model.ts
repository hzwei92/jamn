import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Post } from "src/posts/post.model";

@ObjectType()
export class Profile {
  @Field()
  id: string;

  @Field({ nullable: true })
  indexPostId: string;

  @Field(() => Post, { nullable: true })
  indexPost: Post;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  color: string;

  @Field()
  text: string;

  @Field()
  palette: string;

  @Field(() => Float)
  balance: number;

  @Field(() => Int)
  postCount: number;

  @Field(() => Int)
  tabCount: number;
  
  @Field(() => Int)
  leaderCount: number;

  @Field(() => Int)
  followerCount: number;
  
  @Field()
  createDate: Date;

  @Field()
  updateDate: Date;

  @Field({ nullable: true })
  deleteDate: Date;
}
