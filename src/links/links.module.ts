import { forwardRef, Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksResolver } from './links.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './link.entity';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Link]),
    forwardRef(() => PostsModule),
  ],
  providers: [LinksService, LinksResolver],
  exports: [LinksService],
})
export class LinksModule {}
