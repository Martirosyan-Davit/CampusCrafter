import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { SubmissionFormatEnum } from '../../constants';
import { UseDto } from '../../decorators';
import { CourseEntity } from '../course/course.entity';
import { GradeEntity } from '../grade/grade.entity';
import { AssignmentDto } from './dtos/assignment.dto';

@Entity({ name: ' assignment' })
@UseDto(AssignmentDto)
export class AssignmentEntity extends AbstractEntity<AssignmentDto> {
  @Column({ type: 'uuid' })
  courseId!: Uuid;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'timestamp' })
  dueDate!: Date;

  @Column({ type: 'int' })
  maxScore!: number;

  @Column({
    type: 'enum',
    enum: SubmissionFormatEnum,
    default: SubmissionFormatEnum.DOCUMENT,
  })
  submissionFormat?: SubmissionFormatEnum;

  @OneToOne(() => CourseEntity, (courseEntity) => courseEntity.assignment)
  @JoinColumn({ name: 'course_id' })
  course?: CourseEntity;

  @OneToOne(() => GradeEntity, (gradeEntity) => gradeEntity.assignment)
  grade?: GradeEntity;
}
