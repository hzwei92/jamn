import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { LinksModule } from 'src/links/links.module';
import { PinsModule } from 'src/pins/pins.module';
import { VotesModule } from 'src/votes/votes.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TabsModule } from 'src/tabs/tabs.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([Post]),
    forwardRef(() => ProfilesModule),
    LinksModule,
    PinsModule,
    VotesModule,
    TabsModule,
  ],
  providers: [PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
