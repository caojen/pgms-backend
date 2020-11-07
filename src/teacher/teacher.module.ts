import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { UserService } from 'src/user/user.service';
import { QueryDbService } from 'src/query-db/query-db.service';
import { StudentService } from 'src/student/student.service';
import { BistudentService } from 'src/bistudent/bistudent.service';

@Module({
  providers: [TeacherService, UserService, QueryDbService, StudentService, BistudentService],
  controllers: [TeacherController]
})
export class TeacherModule {}
