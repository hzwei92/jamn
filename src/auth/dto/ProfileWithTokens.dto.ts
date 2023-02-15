import { Field, ObjectType } from "@nestjs/graphql";
import { Profile } from "src/profiles/profile.model";


@ObjectType()
export class ProfileWithTokens {
  @Field(() => Profile, { nullable: true})
  profile: Profile;

  @Field({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  refreshToken: string;
}