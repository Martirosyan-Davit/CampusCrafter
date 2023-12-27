import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';

import { type UserDto } from '../user/dtos/user.dto';
import { type GradeDto } from './dtos/grade.dto';
import { type GradeCreateDto } from './dtos/grade-create.dto';
import { GradeNotFoundException } from './exceptions/grade-not-found.exception';
import { GradeEntity } from './grade.entity';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    private gradeRepository: Repository<GradeEntity>,
  ) {}

  async singleGetAdmin(studentId: Uuid): Promise<GradeDto> {
    const gradeEntity = await this.gradeRepository
      .createQueryBuilder('grade')
      .where('grade.studentId = :studentId', { studentId })
      .getOne();

    if (!gradeEntity) {
      throw new GradeNotFoundException();
    }

    return gradeEntity.toDto();
  }

  async singleGetStudent(studentId: Uuid, userDto: UserDto): Promise<GradeDto> {
    if (studentId !== userDto.id) {
      throw new BadRequestException();
    }

    const gradeEntity = await this.gradeRepository
      .createQueryBuilder('grade')
      .where('grade.studentId = :studentId', { studentId })
      .getOne();

    if (!gradeEntity) {
      throw new GradeNotFoundException();
    }

    return gradeEntity.toDto();
  }

  async singleGetTeacher(studentId: Uuid, userDto: UserDto): Promise<GradeDto> {
    const gradeEntity = await this.gradeRepository
      .createQueryBuilder('grade')
      .where('grade.studentId = :studentId', { studentId })
      .innerJoin('grade.assignment', 'assignment', 'assignment.course')
      .andWhere('assignment.course.teacherId = :teacherId', {
        teacherId: userDto.id,
      })
      .getOne();

    if (!gradeEntity) {
      throw new GradeNotFoundException();
    }

    return gradeEntity.toDto();
  }

  async createGradeAdmin(gradeCreateDto: GradeCreateDto): Promise<GradeDto> {
    const grade = this.gradeRepository.create(gradeCreateDto);
    await this.gradeRepository.save(grade);

    return grade.toDto();
  }

  async createGradeTeacher(
    gradeCreateDto: GradeCreateDto,
    userDto: UserDto,
  ): Promise<GradeDto> {
    const gradeEntity = await this.gradeRepository
      .createQueryBuilder('grade')
      .where('grade.assignmentId = :assignmentId', {
        assignmentId: gradeCreateDto.assignmentId,
      })
      .innerJoin('grade.assignment', 'assignment', 'assignment.course')
      .andWhere('assignment.course.teacherId = :teacherId', {
        teacherId: userDto.id,
      })
      .getOne();

    if (!gradeEntity) {
      throw new BadRequestException();
    }

    const grade = this.gradeRepository.create(gradeCreateDto);
    await this.gradeRepository.save(grade);

    return grade.toDto();
  }
}
