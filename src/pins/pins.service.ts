import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pin } from './pin.entity';
import { Post } from 'src/posts/post.entity';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PinsService {
  constructor(
    @InjectRepository(Pin)
    private readonly pinsRepository: Repository<Pin>,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService
  ) {}

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

      await this.postsService.incrementLeafCount(rootPost.id);
      await this.postsService.incrementRootCount(leafPost.id);
    }
    return pin;
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
