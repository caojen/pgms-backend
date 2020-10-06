import { Test, TestingModule } from '@nestjs/testing';
import { QueryDbService } from './query-db.service';

describe('QueryDbService', () => {
  let service: QueryDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryDbService],
    }).compile();

    service = module.get<QueryDbService>(QueryDbService);
  });

  it('test conection', async () => {
    await service.queryDb('select 1 from user;', []);
  });
});
