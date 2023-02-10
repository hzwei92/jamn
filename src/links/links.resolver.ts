import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Post } from 'src/posts/post.model';
import { PostsService } from 'src/posts/posts.service';
import { Link } from './link.model';
import { LinksService } from './links.service';

@Resolver(() => Link)
export class LinksResolver {
  constructor(
    private readonly linksService: LinksService,
    private readonly postsService: PostsService,
  ) {}

  @ResolveField(() => Post, { name: 'prevPost' })
  async getLinkPrevPost(
    @Parent() link: Link,
  ) {
    return this.postsService.getPostById(link.prevPostId);
  }

  @ResolveField(() => Post, { name: 'nextPost' })
  async getLinkNextPost(
    @Parent() link: Link,
  ) {
    return this.postsService.getPostById(link.nextPostId);
  }


  @Mutation(() => [Link], { name: 'getPrevLinks'})
  async getPrevLinks(
    @Args('postId') postId: string,
  ) {
    return this.linksService.getPrevLinks(postId);
  }

  @Mutation(() => [Link], { name: 'getNextLinks'})
  async getNextLinks(
    @Args('postId') postId: string,
  ) {
    return this.linksService.getNextLinks(postId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Link, { name: 'createLink' })
  async createLink(
    @Args('prevPostId') prevPostId: string,
    @Args('nextPostId') nextPostId: string,
  ) {
    const prevPost = await this.postsService.getPostById(prevPostId);
    if (!prevPost) {
      throw new BadRequestException('prevPostId is invalid');
    }
    const nextPost = await this.postsService.getPostById(nextPostId);
    if (!nextPost) {
      throw new BadRequestException('nextPostId is invalid');
    }
    return this.linksService.createLink(prevPost, nextPost);
  }
}
