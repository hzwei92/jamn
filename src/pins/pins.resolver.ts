import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Post } from 'src/posts/post.model';
import { PostsService } from 'src/posts/posts.service';
import { Pin } from './pin.model';
import { PinsService } from './pins.service';

@Resolver(() => Pin)
export class PinsResolver {
  constructor(
    private readonly pinsService: PinsService,
    private readonly postsService: PostsService,
  ) {}

  @ResolveField(() => Post, { name: 'rootPost' })
  async getPinRootPost(
    @Parent() pin: Pin,
  ) {
    return this.postsService.getPostById(pin.rootPostId);
  }

  @ResolveField(() => Post, { name: 'leafPost' })
  async getPinLeafPost(
    @Parent() pin: Pin,
  ) {
    return this.postsService.getPostById(pin.leafPostId);
  }

  @Mutation(() => [Pin], { name: 'getRootPins'})
  async getRootPins(
    @Args('postId') postId: string,
  ) {
    return this.pinsService.getRootPins(postId);
  }

  @Mutation(() => [Pin], { name: 'getLeafPins'})
  async getLeafPins(
    @Args('postId') postId: string,
  ) {
    return this.pinsService.getLeafPins(postId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Pin, { name: 'createPin' })
  async createPin(
    @Args('rootPostId') rootPostId: string,
    @Args('leafPostId') leafPostId: string,
  ) {
    const rootPost = await this.postsService.getPostById(rootPostId);
    if (!rootPost) {
      throw new BadRequestException('rootPostId is invalid');
    }
    const leafPost = await this.postsService.getPostById(leafPostId);
    if (!leafPost) {
      throw new BadRequestException('leafPostId is invalid');
    }
    return this.pinsService.createPin(rootPost, leafPost);
  }
}
