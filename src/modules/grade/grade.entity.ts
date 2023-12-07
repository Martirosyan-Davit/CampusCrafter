import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { AssignmentEntity } from '../assignment/assignment.entity';
import { UserEntity } from '../user/user.entity';
import { GradeDto } from './dtos/grade.dto';

@Entity({ name: 'grade' })
@UseDto(GradeDto)
export class GradeEntity extends AbstractEntity<GradeDto> {
  @Column({ type: 'uuid' })
  studentId!: Uuid;

  @Column({ type: 'uuid' })
  assignmentId!: Uuid;

  @Column({ type: 'int' })
  score!: number;

  @Column({ type: 'text' })
  feedback!: string;

  @Column({ type: 'timestamp' })
  submissionDate!: Date;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.grade)
  @JoinColumn({ name: 'student_id' })
  student!: UserEntity;

  @OneToOne(
    () => AssignmentEntity,
    (assignmentEntity) => assignmentEntity.grade,
  )
  @JoinColumn({ name: 'assignment_id' })
  assignment!: AssignmentEntity;
}
