import { Field, ObjectType } from "@nestjs/graphql";
import { Link } from "src/links/link.model";
import { Pin } from "src/pins/pin.model";
import { Post } from "../post.model";


@ObjectType()
export class CreatePostResult {
  @Field(() => Post, { nullable: true })
  post: Post;

  @Field(() => Link, { nullable: true })
  prevLink: Link | null;

  @Field(() => Link, { nullable: true })
  nextLink: Link | null;

  @Field(() => Pin, { nullable: true })
  rootPin: Pin | null;

  @Field(() => Pin, { nullable: true })
  leafPin: Pin | null;
}