import { Field, ObjectType } from "@nestjs/graphql";
import { Profile } from "src/profiles/profile.model";


@ObjectType()
export class ProfileWithTokens {
  @Field(() => Profile)
  profile: Profile;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}