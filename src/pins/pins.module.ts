import { forwardRef, Module } from '@nestjs/common';
import { PinsService } from './pins.service';
import { PinsResolver } from './pins.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pin } from './pin.entity';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pin]),
    forwardRef(() => PostsModule),
  ],
  providers: [PinsService, PinsResolver],
  exports: [PinsService],
})
export class PinsModule {}
