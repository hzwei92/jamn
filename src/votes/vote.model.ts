import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Post } from "src/posts/post.model";
import { Profile } from "src/profiles/profile.model";


@ObjectType()
export class Vote {
  @Field()
  id: string;

  @Field()
  profileId: string;

  @Field(() => Profile)
  profile: Profile;

  @Field()
  postId: string;

  @Field(() => Post)
  post: Post

  @Field(() => Int)
  value: number;

  @Field()
  createDate: Date;

  @Field()
  updateDate: Date;

  @Field({ nullable: true })
  deleteDate: Date;
}