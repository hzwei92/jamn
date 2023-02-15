import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentProfile, GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Profile as ProfileEntity } from '../profiles/profile.entity';
import { Profile } from '../profiles/profile.model';
import { ProfilesService } from 'src/profiles/profiles.service';
import { CreatePostResult } from './dto/create-post-result.dto';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly profilesService: ProfilesService,
  ) {}

  @ResolveField(() => Profile, { name: 'profile' })
  async getPostProfile(
    @Parent() post: Post,
  ) {
    return this.profilesService.getProfileById(post.profileId);
  }
  
  @Mutation(() => [Post], { name: 'getPosts' })
  async getPosts() {
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
