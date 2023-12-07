import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseModule } from '../../modules/course/course.module';
import { AssignmentController } from './assignment.controller';
import { AssignmentEntity } from './assignment.entity';
import { AssignmentService } from './assignment.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentEntity]), CourseModule],
  controllers: [AssignmentController],
  exports: [AssignmentService],
  providers: [AssignmentService],
})
export class AssignmentModule {}
