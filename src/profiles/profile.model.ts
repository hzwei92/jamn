import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Profile {
  @Field()
  id: string;

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

  @Field()
  createDate: Date;

  @Field()
  updateDate: Date;

  @Field({ nullable: true })
  deleteDate: Date;
}
