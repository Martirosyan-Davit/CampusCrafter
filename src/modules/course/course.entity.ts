import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CourseStatusEnum } from '../../constants';
import { UseDto } from '../../decorators';
import { AssignmentEntity } from '../assignment/assignment.entity';
import { UserEntity } from '../user/user.entity';
import { CourseDto } from './dtos/course.dto';

@Entity({ name: 'course' })
@UseDto(CourseDto)
export class CourseEntity extends AbstractEntity<CourseDto> {
  @Column({ type: 'uuid' })
  teacherId!: Uuid;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'timestamp' })
  startDate!: Date;

  @Column({ type: 'int' })
  credits!: number;

  @Column({ type: 'int' })
  enrollmentLimit!: number;

  @Column({
    type: 'enum',
    enum: CourseStatusEnum,
    default: CourseStatusEnum.UPCOMING,
  })
  status?: CourseStatusEnum;

  @OneToOne(
    () => AssignmentEntity,
    (assignmentEntity) => assignmentEntity.course,
  )
  assignment?: AssignmentEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.courses)
  @JoinColumn({ name: 'teacher_id' })
  teacher?: UserEntity | null;
}
