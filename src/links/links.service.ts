import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';
import { Post } from 'src/posts/post.entity';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}

  async getLinkByPrevIdAndNextId(prevPostId: string, nextPostId: string) {
    return this.linksRepository.findOne({
      where: {
        prevPostId,
        nextPostId,
      }
    });
  }

  async createLink(prevPost: Post, nextPost: Post) {
    let link = await this.getLinkByPrevIdAndNextId(prevPost.id, nextPost.id);
    if (!link) {
      link = new Link();
      link.prevPostId = prevPost.id;
      link.nextPostId = nextPost.id;
      link = await this.linksRepository.save(link);

      await this.postsService.incrementNextCount(prevPost.id);
      await this.postsService.incrementPrevCount(nextPost.id);
    }
    return link;
  }

  async getPrevLinks(postId: string) {
    return this.linksRepository.find({
      where: {
        nextPostId: postId,
      },
      order: {
        createDate: 'DESC',
      }
    });
  }

  async getNextLinks(postId: string) {
    return this.linksRepository.find({
      where: {
        prevPostId: postId,
      },
      order: {
        createDate: 'DESC',
      }
    });
  }
}
