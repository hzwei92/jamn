import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentProfile, GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Post } from 'src/posts/post.model';
import { PostsService } from 'src/posts/posts.service';
import { Profile as ProfileEntity } from 'src/profiles/profile.entity';
import { Vote } from './vote.model';
import { VotesService } from './votes.service';

@Resolver(() => Vote)
export class VotesResolver {
  constructor(
    private readonly votesService: VotesService,
    private readonly postsService: PostsService,
  ) {}

  @ResolveField(() => Post, { name: 'post' })
  async getVotePost(
    @Parent() vote: Vote,
  ) {
    return this.postsService.getPostById(vote.postId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Vote, { name: 'vote' })
  async vote(
    @CurrentProfile() profile: ProfileEntity,
    @Args('postId') postId: string,
    @Args('value', { type: () => Int }) value: number,
  ) {
    if (value !== 1 && value !== 0 && value !== -1) {
      throw new BadRequestException('Vote value must be 1, 0, or -1');
    }

    const post = await this.postsService.getPostById(postId);
    if (!post) {
      throw new BadRequestException('Post not found')
    }

    return this.votesService.vote(profile, post, value);
  }
}
