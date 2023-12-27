import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  Unique,
  UpdateDateColumn,
  VirtualColumn,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { UseDto } from '../../decorators';
import { CourseEntity } from '../course/course.entity';
import { GradeEntity } from '../grade/grade.entity';
import { UserDto } from './dtos/user.dto';

@Entity({ name: 'users' })
@Unique(['email'])
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  //   @Column({ type: 'varchar' })
  //   name!: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.STUDENT })
  role!: RoleType;

  @Column({ nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ nullable: true, type: 'varchar' })
  avatarUrl!: string | null;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  lastLogin!: Date | null;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @Column({ nullable: true, type: 'varchar' })
  bio!: string | null;

  @OneToMany(() => CourseEntity, (courseEntity) => courseEntity.teacher)
  courses?: CourseEntity[] | null;

  @OneToOne(() => GradeEntity, (gradeEntity) => gradeEntity.student)
  grade?: GradeEntity;
}
