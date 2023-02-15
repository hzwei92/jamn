import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesResolver } from './profiles.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    PostsModule,
  ],
  providers: [ProfilesService, ProfilesResolver],
  exports: [ProfilesService],
})
export class ProfilesModule {}
