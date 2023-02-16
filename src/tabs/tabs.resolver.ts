import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentProfile, GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Post } from 'src/posts/post.model';
import { PostsService } from 'src/posts/posts.service';
import { Tab } from './tab.model';
import { TabsService } from './tabs.service';
import { Profile as ProfileEntity } from 'src/profiles/profile.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile } from 'src/profiles/profile.model';

@Resolver(() => Tab)
export class TabsResolver {
  constructor(
    private readonly tabsService: TabsService,
    private readonly profilesService: ProfilesService,
    private readonly postsService: PostsService,
  ) {}

  @ResolveField(() => Profile, { name: 'profile' })
  async getTabProfile(
    @Parent() tab: Tab,
  ) {
    return this.profilesService.getProfileById(tab.profileId);
  }

  @ResolveField(() => Post, { name: 'post' })
  async getTabPost(
    @Parent() tab: Tab,
  ) {
    return this.postsService.getPostById(tab.postId);
  }

  @Mutation(() => [Tab], { name: 'getTabs' })
  async getTabs(
    @Args('profileId') profileId: string,
  ) {
    return this.tabsService.getTabsByProfileId(profileId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Tab, { name: 'createTab' })
  async createTab(
    @CurrentProfile() profile: ProfileEntity,
    @Args('postId') postId: string,
  ) {
    const post = await this.postsService.getPostById(postId);
    if (!post) {
      throw new BadRequestException('Post not found')
    }

    return this.tabsService.createTab(profile, post);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Tab, { name: 'deleteTab' })
  async deleteTab(
    @CurrentProfile() profile: ProfileEntity,
    @Args('tabId') tabId: string,
  ) {
    const tab = await this.tabsService.getTabById(tabId);
    if (!tab) {
      throw new BadRequestException('Tab not found')
    }

    return this.tabsService.deleteTab(profile, tab);

  }
}
