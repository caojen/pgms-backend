import { Test, TestingModule } from '@nestjs/testing';
import { QueryDbService } from 'src/query-db/query-db.service';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';
import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherService, QueryDbService, UserService, StudentService],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
  });

  it('should be defined', () => {
    const a = 1;
  });
});
