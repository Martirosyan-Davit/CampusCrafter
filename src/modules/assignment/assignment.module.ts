import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseModule } from '../course/course.module';
import { GradeModule } from '../grade/grade.module';
import { AssignmentController } from './assignment.controller';
import { AssignmentEntity } from './assignment.entity';
import { AssignmentService } from './assignment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssignmentEntity]),
    forwardRef(() => CourseModule),
    GradeModule,
  ],
  controllers: [AssignmentController],
  exports: [AssignmentService],
  providers: [AssignmentService],
})
export class AssignmentModule {}
