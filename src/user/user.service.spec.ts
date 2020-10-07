import { Test, TestingModule } from '@nestjs/testing';
import { EndeService } from 'src/ende/ende.service';
import { QueryDbService } from 'src/query-db/query-db.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, EndeService, QueryDbService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('err username or password', async () => {
    expect(await service.userLogin("username", "password")).toBe(false);
  });

  it('should pass', async() => {
    expect(await service.userLogin("admin", "123456")).not.toBe(true);
  })

  it('should pass', async() => {
    expect(await service.userLogin("admin", "123456789")).not.toBe(false);
  })

  it('should pass', async() => {
    expect(await service.userLogout(1)).toBe(true);
  })
});
