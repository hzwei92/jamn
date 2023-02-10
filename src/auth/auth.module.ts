import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { JwtAuthStrategy } from './jwt-auth.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    ProfilesModule,
  ],
  providers: [AuthService, AuthResolver, JwtAuthStrategy]
})
export class AuthModule {}
