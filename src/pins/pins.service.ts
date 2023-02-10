import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pin } from './pin.entity';
import { Post } from 'src/posts/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { Profile } from 'src/profiles/profile.entity';

@Injectable()
export class PinsService {
  constructor(
    @InjectRepository(Pin)
    private readonly pinsRepository: Repository<Pin>,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService
  ) {}

  async getPinById(id: string) {
    return this.pinsRepository.findOne({
      where: {
        id
      }
    });
  }

  async getPinByRootIdAndLeafId(rootPostId: string, leafPostId: string) {
    return this.pinsRepository.findOne({
      where: {
        rootPostId,
        leafPostId,
      }
    });
  }

  async createPin(rootPost: Post, leafPost: Post) {
    let pin = await this.getPinByRootIdAndLeafId(rootPost.id, leafPost.id);
    if (!pin) {
      pin = new Pin();
      pin.rootPostId = rootPost.id;
      pin.leafPostId = leafPost.id;
      pin = await this.pinsRepository.save(pin);

      await this.postsService.incrementLeafCount(rootPost.id, 1);
      await this.postsService.incrementRootCount(leafPost.id, 1);
    }
    return pin;
  }

  async deletePin(profile: Profile, pin: Pin) {
    const rootPost = await this.postsService.getPostById(pin.rootPostId);

    if (rootPost.profileId !== profile.id) {
      throw new BadRequestException('Only the root post owner can delete the pin');
    }

    await this.postsService.incrementLeafCount(pin.rootPostId, -1);
    await this.postsService.incrementRootCount(pin.leafPostId, -1);
    pin.deleteDate = new Date();

    return this.pinsRepository.save(pin);
  }

  async getRootPins(postId: string) {
    return this.pinsRepository.find({
      where: {
        leafPostId: postId,
      },
      order: {
        createDate: 'DESC',
      },
    });
  }

  async getLeafPins(postId: string) {
    return this.pinsRepository.find({
      where: {
        rootPostId: postId,
      },
      order: {
        createDate: 'DESC',
      },
    });
  }
}
