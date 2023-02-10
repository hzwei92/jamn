import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { LinksModule } from 'src/links/links.module';
import { PinsModule } from 'src/pins/pins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    ProfilesModule,
    LinksModule,
    PinsModule,
  ],
  providers: [PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
