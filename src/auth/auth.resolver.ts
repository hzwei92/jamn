import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { ProfileWithTokens } from './dto/ProfileWithTokens.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => ProfileWithTokens, { name: 'login' })
  async login(
    @Args('credential') credential: string,
  ) {
    return this.authService.login(credential);
  }


  @Mutation(() => ProfileWithTokens, { name: 'refreshAccessToken' })
  async refreshAccessToken(
    @Args('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
