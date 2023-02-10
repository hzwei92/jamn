import { Test, TestingModule } from '@nestjs/testing';
import { PinsResolver } from './pins.resolver';

describe('PinsResolver', () => {
  let resolver: PinsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PinsResolver],
    }).compile();

    resolver = module.get<PinsResolver>(PinsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
