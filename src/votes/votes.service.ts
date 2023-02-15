import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { Profile } from 'src/profiles/profile.entity';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    private readonly postsService: PostsService,
  ) {}

  async getVoteByProfileIdAndPostId(profileId: string, postId: string) {
    const vote = await this.voteRepository.findOne({
      where: { 
        profileId, 
        postId,
      },
    });

    return vote;
  }

  async vote(profile: Profile, post: Post, value: number) {
    const vote = await this.voteRepository.findOne({
      where: { 
        profileId: profile.id, 
        postId: post.id,
      },
    });

    if (vote) {
      await this.postsService.incrementUpvotes(post.id, value - vote.value);
      vote.value = value;
      return this.voteRepository.save(vote);
    } else {
      await this.postsService.incrementUpvotes(post.id, value);
      const newVote = new Vote();
      newVote.profileId = profile.id;
      newVote.postId = post.id;
      newVote.value = value;
      return this.voteRepository.save(newVote);
    }
  }
  
}
