import { ExecutionContext, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { Args, Context, GqlExecutionContext, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentProfile, GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Profile as ProfileEntity } from '../profiles/profile.entity';
import { Profile } from '../profiles/profile.model';
import { ProfilesService } from 'src/profiles/profiles.service';
import { CreatePostResult } from './dto/create-post-result.dto';
import { Vote } from 'src/votes/vote.model';
import { VotesService } from 'src/votes/votes.service';
import { GqlInterceptor } from 'src/auth/gql.interceptor';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly profilesService: ProfilesService,
    private readonly votesService: VotesService,
  ) {}

  @ResolveField(() => Profile, { name: 'profile' })
  async getPostProfile(
    @Parent() post: Post,
  ) {
    return this.profilesService.getProfileById(post.profileId);
  }

  @ResolveField(() => Vote, { name: 'currentProfileVote', nullable: true })
  async getPostCurrentUserVote(
    @Context() ctx: any,
    @Parent() post: Post,
  ) {
    const profileId = ctx.req.headers.profileId;
    if (!profileId) return null;
    return this.votesService.getVoteByProfileIdAndPostId(profileId, post.id);
  }
  

  @UseInterceptors(GqlInterceptor)
  @Mutation(() => [Post], { name: 'getPosts' })
  async getPosts(
  ) {
    return this.postsService.getPosts();
  }

  @Mutation(() => Post, { name: 'getPost' })
  async getPost(
    @Args('postId') postId: string,
  ) {
    return this.postsService.getPostById(postId);
  }
  
  @UseGuards(GqlAuthGuard)
  @Mutation(() => CreatePostResult, { name: 'createPost' })
  async createPost(
    @CurrentProfile() profile: ProfileEntity,
    @Args('text') text: string,
    @Args('contextPostId', { nullable: true }) contextPostId: string | null,
    @Args('contextDirection', { nullable: true }) contextDirection: string | null,
  ) {
    return this.postsService.createPost(profile, text, contextPostId, contextDirection);
  }

}
