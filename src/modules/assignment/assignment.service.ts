import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, Repository } from 'typeorm';

import { type PageDto } from '../../common/dto/page.dto';
import { CourseService } from '..//course/course.service';
import { type UserDto } from '../user/dtos/user.dto';
import { AssignmentEntity } from './assignment.entity';
import { type AssignmentDto } from './dtos/assignment.dto';
import {
  type AssignmentAdminCreateDto,
  type AssignmentCreateDto,
} from './dtos/assignment-create.dto';
import { type AssignmentPageOptionsDto } from './dtos/assignment-page-options.dto';
import { type UpdateAssignmentDto } from './dtos/assignment-update.dto';
import { AssignmentNotFoundException } from './exceptions/assignment-not-found.exception';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private assignmentRepository: Repository<AssignmentEntity>,
    private courseService: CourseService,
  ) {}

  /**
   * Find single user
   */
  findOne(
    findData: FindOptionsWhere<AssignmentEntity>,
  ): Promise<AssignmentEntity | null> {
    return this.assignmentRepository.findOneBy(findData);
  }

  //   async findByUsernameOrEmail(
  //     options: Partial<{ username: string; email: string }>,
  //   ): Promise<UserEntity | null> {
  //     const queryBuilder = this.userRepository
  //       .createQueryBuilder('user')
  //       .leftJoinAndSelect<UserEntity, 'user'>('user.settings', 'settings');

  //     if (options.email) {
  //       queryBuilder.orWhere('user.email = :email', {
  //         email: options.email,
  //       });
  //     }

  //     if (options.username) {
  //       queryBuilder.orWhere('user.username = :username', {
  //         username: options.username,
  //       });
  //     }

  //     return queryBuilder.getOne();
  //   }

  async createAssignmentAdmin(
    assignmentCreateDto: AssignmentAdminCreateDto,
  ): Promise<AssignmentDto> {
    const assignment = this.assignmentRepository.create(assignmentCreateDto);
    await this.assignmentRepository.save(assignment);

    return assignment.toDto();
  }

  async createAssignment(
    assignmentCreateDto: AssignmentCreateDto,
    userDto: UserDto,
  ): Promise<AssignmentDto> {
    const course = await this.courseService.getCourse(
      assignmentCreateDto.courseId,
    );

    if (course.teacherId !== userDto.id) {
      throw new BadRequestException();
    }

    const assignment = this.assignmentRepository.create(assignmentCreateDto);
    await this.assignmentRepository.save(assignment);

    return assignment.toDto();
  }

  async updateAssignment(
    id: Uuid,
    updateAssignmentDto: UpdateAssignmentDto,
    userDto: UserDto,
  ): Promise<void> {
    const assignmentEntity = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.id = :id', { id })
      .getOne();

    if (!assignmentEntity) {
      throw new AssignmentNotFoundException();
    }

    const course = await this.courseService.getCourse(
      assignmentEntity.courseId,
    );

    if (course.teacherId !== userDto.id) {
      throw new BadRequestException();
    }

    this.assignmentRepository.merge(assignmentEntity, updateAssignmentDto);

    await this.assignmentRepository.save(assignmentEntity);
  }

  async updateAssignmentAdmin(
    id: Uuid,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<void> {
    const assignmentEntity = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.id = :id', { id })
      .getOne();

    if (!assignmentEntity) {
      throw new AssignmentNotFoundException();
    }

    this.assignmentRepository.merge(assignmentEntity, updateAssignmentDto);

    await this.assignmentRepository.save(assignmentEntity);
  }

  async deleteAssignment(id: Uuid, userDto: UserDto): Promise<void> {
    const assignmentEntity = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.id = :id', { id })
      .getOne();

    if (!assignmentEntity) {
      throw new AssignmentNotFoundException();
    }

    const course = await this.courseService.getCourse(
      assignmentEntity.courseId,
    );

    if (course.teacherId !== userDto.id) {
      throw new BadRequestException();
    }

    await this.assignmentRepository
      .createQueryBuilder()
      .where('assignment.id = :id', { id })
      .delete()
      .execute();
  }

  async deleteAssignmentAdmin(id: Uuid): Promise<void> {
    const assignmentEntity = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.id = :id', { id })
      .getOne();

    if (!assignmentEntity) {
      throw new AssignmentNotFoundException();
    }

    await this.assignmentRepository
      .createQueryBuilder()
      .where('assignment.id = :id', { id })
      .delete()
      .execute();
  }

  async getAllForStudent(
    pageOptionsDto: AssignmentPageOptionsDto,
    userDto: UserDto,
    courseId: Uuid,
  ): Promise<PageDto<AssignmentDto>> {
    const queryBuilder = this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.courseId = :courseId', { courseId })
      .innerJoin('assignment.grade', 'grade', 'grade.studentId = :studentId', {
        studentId: userDto.id,
      });

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getAllAdmin(
    pageOptionsDto: AssignmentPageOptionsDto,
    courseId: Uuid,
  ): Promise<PageDto<AssignmentDto>> {
    const queryBuilder = this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.courseId = :courseId', { courseId });

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSingle(
    assignmentId: Uuid,
    userDto: UserDto,
  ): Promise<AssignmentDto> {
    const queryBuilder = this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.id = :assignmentId', { assignmentId })
      .innerJoin(
        'assignment.course',
        'course',
        'course.teacherId = :teacherId',
        { teacherId: userDto.id },
      );

    const assignmentEntity = await queryBuilder.getOne();

    if (!assignmentEntity) {
      throw new AssignmentNotFoundException();
    }

    return assignmentEntity.toDto();
  }
}
