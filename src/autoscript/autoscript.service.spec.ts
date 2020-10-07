import { Test, TestingModule } from '@nestjs/testing';
import { QueryDbService } from 'src/query-db/query-db.service';
import { AutoscriptService } from './autoscript.service';

describe('AutoscriptService', () => {
  let service: AutoscriptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoscriptService, QueryDbService],
    }).compile();

    service = module.get<AutoscriptService>(AutoscriptService);
  });

  it('should be defined', async () => {
    // expect(service).toBeDefined();
    await service.fetchRecords();
  });
});
