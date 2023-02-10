import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentProfile, GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Profile } from './profile.model';
import { ProfilesService } from './profiles.service';
import { Profile as ProfileEntity } from './profile.entity';

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(
    private readonly profilesService: ProfilesService,
  ) {}

  @Query(() => Profile, { name: 'getProfile' })
  async getProfile(
    @Args('id') id: string,
  ) {
    return this.profilesService.getProfileById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Profile, { name: 'getCurrentProfile' })
  async getCurrentProfile(
    @CurrentProfile() profile: ProfileEntity,
  ) {
    return this.profilesService.getProfileById(profile.id);
  }

}
