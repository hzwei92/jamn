import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { Vote } from './vote.entity';
import { VotesResolver } from './votes.resolver';
import { VotesService } from './votes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote]),
    forwardRef(() => PostsModule),
  ],
  providers: [VotesResolver, VotesService],
  exports: [VotesService],
})
export class VotesModule {}
