import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, Repository } from 'typeorm';

import { type PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { CourseNotFoundException } from '../course/exceptions/cource-not-found.exception';
import { type UserDto } from '../user/dtos/user.dto';
import { CourseEntity } from './course.entity';
import { type CourseDto } from './dtos/course.dto';
import {
  type CourseCreateDto,
  type CreateCourseAdminDto,
} from './dtos/course-create.dto';
import { type CoursePageOptionsDto } from './dtos/course-page-options.dto';
import { type UpdateCourseDto } from './dtos/course-update.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
  ) {}

  /**
   * Find single user
   */
  findOne(
    findData: FindOptionsWhere<CourseEntity>,
  ): Promise<CourseEntity | null> {
    return this.courseRepository.findOneBy(findData);
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

  async createCourse(
    courseCreateDto: CourseCreateDto,
    id: Uuid,
  ): Promise<CourseDto> {
    const course = this.courseRepository.create(courseCreateDto);
    course.teacherId = id;
    await this.courseRepository.save(course);

    return course.toDto();
  }

  async createCourseAdmin(
    courseCreateDto: CreateCourseAdminDto,
  ): Promise<CourseDto> {
    const course = this.courseRepository.create(courseCreateDto);
    await this.courseRepository.save(course);

    return course.toDto();
  }

  async getCourses(
    pageOptionsDto: CoursePageOptionsDto,
  ): Promise<PageDto<CourseDto>> {
    const queryBuilder = this.courseRepository.createQueryBuilder('course');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getCourse(courseId: Uuid): Promise<CourseDto> {
    const queryBuilder = this.courseRepository.createQueryBuilder('course');

    queryBuilder.where('course.id = :courseId', { courseId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new CourseNotFoundException();
    }

    return userEntity.toDto();
  }

  async updateCourse(
    id: Uuid,
    updateCourseDto: UpdateCourseDto,
    userDto: UserDto,
  ): Promise<void> {
    const courseEntity = await this.courseRepository
      .createQueryBuilder('course')
      .where('course.id = :id', { id })
      .getOne();

    if (!courseEntity) {
      throw new CourseNotFoundException();
    }

    if (
      userDto.role === RoleType.TEACHER &&
      courseEntity.teacherId !== userDto.id
    ) {
      throw new BadRequestException();
    }

    this.courseRepository.merge(courseEntity, updateCourseDto);

    await this.courseRepository.save(courseEntity);
  }

  async deleteCourses(courseId: Uuid, userDto: UserDto): Promise<void> {
    const courseEntity = await this.courseRepository
      .createQueryBuilder('course')
      .where('course.id = :courseId', { courseId })
      .getOne();

    if (!courseEntity) {
      throw new CourseNotFoundException();
    }

    if (
      userDto.role === RoleType.TEACHER &&
      courseEntity.teacherId !== userDto.id
    ) {
      throw new BadRequestException();
    }

    await this.courseRepository
      .createQueryBuilder()
      .where('course.id = :courseId', { courseId })
      .delete()
      .execute();
  }
}
