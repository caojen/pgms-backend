import { Test, TestingModule } from '@nestjs/testing';
import { QueryDbService } from 'src/query-db/query-db.service';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, UserService, QueryDbService, StudentService, TeacherService],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should pass', () => {
    const a=1;
  });
});
