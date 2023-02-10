import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import * as bcrypt from 'bcrypt';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  async getProfileById(id: string): Promise<Profile> {
    return await this.profilesRepository.findOne({
      where: {
        id,
      }
    });
  }

  async getProfileByEmail(email: string): Promise<Profile> {
    return await this.profilesRepository.findOne({
      where: {
        email,
      }
    });
  }

  async getProfileIfRefreshTokenMatches(profileId: string, refreshToken: string): Promise<Profile> {
    if (!profileId || !refreshToken) return null;

    const profile = await this.getProfileById(profileId);
    if (!profile || !profile.hashedRefreshToken) return null;

    const isMatching = await bcrypt.compare(refreshToken, profile.hashedRefreshToken);
    if (!isMatching) return null;

    return profile;
  }

  async createProfile(email: string): Promise<Profile> {
    const profile = new Profile();
    profile.email = email;
    
    profile.name = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      length: 2,
      separator: '-',
    }) + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    profile.color = '#' + Math.floor(Math.random() * (16 ** 6)).toString(16).padStart(6, '0');

    return this.profilesRepository.save(profile);
  }

  async setRefreshToken(profileId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const profile = await this.getProfileById(profileId);
    
    profile.hashedRefreshToken = hashedRefreshToken;

    await this.profilesRepository.save(profile);
  }

  async incrementPostCount(profileId: string): Promise<void> {
    await this.profilesRepository.increment({ id: profileId }, 'postCount', 1);
  }
}
