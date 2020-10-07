import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { UserService } from 'src/user/user.service';
import { QueryDbService } from 'src/query-db/query-db.service';

@Module({
  providers: [StudentService, UserService, QueryDbService],
  controllers: [StudentController]
})
export class StudentModule {}
