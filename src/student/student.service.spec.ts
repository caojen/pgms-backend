import { Test, TestingModule } from '@nestjs/testing';
import { EndeService } from 'src/ende/ende.service';
import { QueryDbService } from 'src/query-db/query-db.service';
import { UserService } from 'src/user/user.service';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService, EndeService, QueryDbService, UserService],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should pass', () => {
    const a = 1;
  });

  it('student get teacher', async() => {
    expect(await service.getTeacherOfStudent(1)).not.toBe({
      "name": "teacher",
      "email": "abc@mail.qq.com",
      "personal_page": "abc",
      "research_area": "edf"
  });
  })
}); 
