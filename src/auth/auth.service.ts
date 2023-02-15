import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from 'src/profiles/profiles.service';
import TokenPayload from './tokenPayload.interface';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly profilesService: ProfilesService,
  ) {
    this.oauthClient = new OAuth2Client(configService.get('GOOGLE_CLIENT_ID'));
  }

  oauthClient: OAuth2Client;

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      });

      const profile = await this.profilesService.getProfileIfRefreshTokenMatches(payload.profileId, refreshToken);

      if (!profile) {
        return {
          profile: null,
          accessToken: null,
          refreshToken: null,
        }
      }

      return {
        profile,
        accessToken: this.getAccessToken(profile.id),
        refreshToken,
      }
    }
    catch (err) {
      if (err.message === 'jwt expired') {
        throw new BadRequestException('Refresh token expired');
      }
    }
  }

  async login(credential: string) {
    const email = await this.verify(credential);
    let profile = await this.profilesService.getProfileByEmail(email);

    if (!profile) {
      profile = await this.profilesService.createProfile(email);
    }

    const accessToken = this.getAccessToken(profile.id);
    const refreshToken = await this.getRefreshToken(profile.id);

    return {
      profile, 
      accessToken,
      refreshToken,
    }
  }

  async verify(token: string) {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });
    const payload = ticket.getPayload();
    console.log(payload);
    return payload.email;
  }

  getAccessToken(profileId: string) {
    const payload: TokenPayload = { profileId };
    
    const expirationTime = this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME');

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${expirationTime}s`,
    });

    return token;
  }

  async getRefreshToken(profileId: string) {
    const payload: TokenPayload = { profileId };

    const expirationTime = this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME');

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${expirationTime}s`,
    });

    await this.profilesService.setRefreshToken(profileId, token);

    return token;
  }

}
