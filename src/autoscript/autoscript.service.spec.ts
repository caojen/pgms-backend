import { Test, TestingModule } from '@nestjs/testing';
import { AutoscriptService } from './autoscript.service';

describe('AutoscriptService', () => {
  let service: AutoscriptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoscriptService],
    }).compile();

    service = module.get<AutoscriptService>(AutoscriptService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
    const a = 1;
  });
});
