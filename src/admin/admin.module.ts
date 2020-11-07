import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserService } from 'src/user/user.service';
import { QueryDbService } from 'src/query-db/query-db.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { StudentService } from 'src/student/student.service';
import { BistudentService } from 'src/bistudent/bistudent.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, UserService, QueryDbService, TeacherService, StudentService, BistudentService]
})
export class AdminModule {}
