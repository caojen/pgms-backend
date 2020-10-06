import { Test, TestingModule } from '@nestjs/testing';
import { EndeService } from './ende.service';

describe('EndeService', () => {
  let service: EndeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EndeService],
    }).compile();

    service = module.get<EndeService>(EndeService);
  });
  it('should pass', () => {
    const a = 1+1;
  });
});
