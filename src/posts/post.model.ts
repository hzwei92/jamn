import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Profile } from "src/profiles/profile.model";

@ObjectType()
export class Post {
  @Field()
  id: string;

  @Field()
  profileId: string;

  @Field(() => Profile)
  profile: Profile;

  @Field(() => Int)
  profileIndex: number;
  
  @Field({ nullable: true })
  name: string;

  @Field()
  text: string;
  
  @Field(() => Int)
  upvotes: number;

  @Field(() => Int)
  prevCount: number;

  @Field(() => Int)
  nextCount: number;

  @Field(() => Int)
  rootCount: number;

  @Field(() => Int)
  leafCount: number;

  @Field()
  createDate: Date;

  @Field()
  updateDate: Date;

  @Field({ nullable: true })
  deleteDate: Date;
}
