import { Field, ObjectType } from "@nestjs/graphql";
import { Post } from "src/posts/post.model";
import { Profile } from "src/profiles/profile.model";


@ObjectType()
export class Tab {
  @Field()
  id: string;
  
  @Field()
  profileId: string;

  @Field(() => Profile)
  profile: Profile;

  @Field()
  postId: string;
  
  @Field(() => Post)
  post: Post;

  @Field()
  createDate: Date;

  @Field()
  updateDate: Date;

  @Field({ nullable: true })
  deleteDate: Date | null;
}