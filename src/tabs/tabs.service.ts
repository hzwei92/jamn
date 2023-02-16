import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { Profile } from 'src/profiles/profile.entity';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Repository } from 'typeorm';
import { Tab } from './tab.entity';

@Injectable()
export class TabsService {
  constructor(
    @InjectRepository(Tab)
    private readonly tabsRepository: Repository<Tab>,
    private readonly profilesService: ProfilesService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}

  async getTabById(id: string) {
    return this.tabsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getTabsByProfileId(profileId: string): Promise<Tab[]> {
    return this.tabsRepository.find({
      where: {
        profileId,
      },
      order: {
        createDate: 'DESC',
      },
      take: 42,
    });
  }

  async createTab(profile: Profile, post: Post) {
    await this.profilesService.incrementTabCount(profile.id, 1);
    await this.postsService.incrementTabCount(post.id, 1);

    const tab = new Tab();
    tab.profileId = profile.id;
    tab.postId = post.id;
    return this.tabsRepository.save(tab);
  }

  async deleteTab(profile: Profile, tab: Tab) {
    if (tab.profileId !== profile.id) {
      throw new BadRequestException('Only the profile owner can delete the tab');
    }

    await this.profilesService.incrementTabCount(profile.id, -1);
    await this.postsService.incrementTabCount(tab.postId, -1);
    tab.deleteDate = new Date();

    return this.tabsRepository.save(tab);
  }
}
