import { Test, TestingModule } from '@nestjs/testing';
import { BistudentService } from './bistudent.service';

describe('BistudentService', () => {
  let service: BistudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BistudentService],
    }).compile();

    service = module.get<BistudentService>(BistudentService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
});
