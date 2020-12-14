import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryDbModule } from './query-db/query-db.module';
import { UserModule } from './user/user.module';
import { EndeModule } from './ende/ende.module';
import { StudentModule } from './student/student.module';
import { AutoscriptModule } from './autoscript/autoscript.module';
import { TeacherModule } from './teacher/teacher.module';
import { AdminModule } from './admin/admin.module';
import { BistudentModule } from './bistudent/bistudent.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [QueryDbModule, UserModule, EndeModule, StudentModule, AutoscriptModule, TeacherModule, AdminModule, BistudentModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
