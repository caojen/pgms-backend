import { Module } from '@nestjs/common';
import { BistudentService } from './bistudent.service';
import { BistudentController } from './bistudent.controller';
import { UserService } from 'src/user/user.service';
import { QueryDbService } from 'src/query-db/query-db.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { StudentService } from 'src/student/student.service';

@Module({
  providers: [BistudentService, UserService, QueryDbService, TeacherService, StudentService],
  controllers: [BistudentController]
})
export class BistudentModule {}
