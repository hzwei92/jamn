import { forwardRef, Module } from '@nestjs/common';
import { TabsService } from './tabs.service';
import { TabsResolver } from './tabs.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tab } from './tab.entity';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tab]),
    forwardRef(() => ProfilesModule),
    forwardRef(() => PostsModule),
  ],
  providers: [TabsService, TabsResolver],
  exports: [TabsService],
})
export class TabsModule {}
