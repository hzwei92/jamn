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

    let prevLink = null;
    let nextLink = null;
    let rootPin = null;
    let leafPin = null;

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
        prevLink = await this.linksService.createLink(post, contextPost);
      }
      else if (contextDirection === PostDirection.NEXT) {
        nextLink = await this.linksService.createLink(contextPost, post);
      }
      else if (contextDirection === PostDirection.ROOT) {
        rootPin = await this.pinsService.createPin(post, contextPost);
      }
      else if (contextDirection === PostDirection.LEAF) {
        leafPin = await this.pinsService.createPin(contextPost, post);
      }
    }

    return {
      post,
      prevLink,
      nextLink,
      rootPin,
      leafPin,
    };
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
