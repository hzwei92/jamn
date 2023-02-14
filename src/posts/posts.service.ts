import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostDirection } from 'src/enums';
import { LinksService } from 'src/links/links.service';
import { PinsService } from 'src/pins/pins.service';
import { Profile } from 'src/profiles/profile.entity';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly profilesService: ProfilesService,
    private readonly linksService: LinksService,
    private readonly pinsService: PinsService,
  ) {}

  async getPostById(id: string): Promise<Post> {
    return this.postsRepository.findOne({
      where: {
        id,
      }
    });
  }
  
  async getPosts(): Promise<Post[]> {
    return this.postsRepository.find({
      order: {
        createDate: 'DESC',
      },
      take: 42,
    });
  }

  async createPost(profile: Profile, text: string, contextPostId: string | null, contextDirection: string | null) {
    let post = new Post();
    post.profileId = profile.id;
    post.profileIndex = profile.postCount;
    post.text = text;
    post = await this.postsRepository.save(post);

    await this.profilesService.incrementPostCount(profile.id);

    if (contextPostId && contextDirection) {
      const contextPost = await this.postsRepository.findOne({
        where: {
          id: contextPostId
        } 
      });
      if (!contextPost) {
        throw new BadRequestException('Context post not found');
      }

      if (contextDirection === PostDirection.PREV) {
        const prevLink = await this.linksService.createLink(post, contextPost);
        return { prevLink };
      }
      else if (contextDirection === PostDirection.NEXT) {
        const nextLink = await this.linksService.createLink(contextPost, post);
        return { nextLink };
      }
      else if (contextDirection === PostDirection.ROOT) {
        const rootPin = await this.pinsService.createPin(post, contextPost);
        return { rootPin };
      }
      else if (contextDirection === PostDirection.LEAF) {
        const leafPin = await this.pinsService.createPin(contextPost, post);
        return { leafPin };
      }
    }
    else {
      return { post };
    }
  }

  async incrementPrevCount(postId: string, amount: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'prevCount', amount);
  }

  async incrementNextCount(postId: string, amount: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'nextCount', amount);
  }

  async incrementRootCount(postId: string, amount: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'rootCount', amount);
  }

  async incrementLeafCount(postId: string, amount: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'leafCount', amount);
  }
}
