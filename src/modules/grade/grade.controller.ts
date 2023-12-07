import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { ApiVersionEnum, RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { ApiVersion } from '../../decorators/version.decorators';
import { UserDto } from '../user/dtos/user.dto';
import { GradeDto } from './dtos/grade.dto';
import { GradeCreateDto } from './dtos/grade-create.dto';
import { GradeService } from './grade.service';


@Controller('assignments')
@ApiTags('assignments')
export class GradeController {
  constructor(private gradeService: GradeService) {}

  @Post()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Create Grade Admin',
    type: GradeDto,
  })
  async createForAdmin(
    @Body() gradeCreateDto: GradeCreateDto,
  ): Promise<GradeDto> {
    return this.gradeService.createGradeAdmin(gradeCreateDto);
  }

  @Post(':id')
  @Auth([RoleType.TEACHER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Create Grade Teacher',
    type: GradeDto,
  })
  async create(
    @UUIDParam('id') assignmentId: Uuid,
    @Body() gradeCreateDto: GradeCreateDto,
    @AuthUser() userDto: UserDto,
  ): Promise<GradeDto> {
    return this.gradeService.createGradeTeacher(
      assignmentId,
      gradeCreateDto,
      userDto,
    );
  }

  @Get(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get  Grade by student id',
    type: GradeDto,
  })
  @ApiVersion(ApiVersionEnum.ADMIN)
  async getCoursesAdmin(@UUIDParam('id') studentId: Uuid): Promise<GradeDto> {
    return this.gradeService.singleGetAdmin(studentId);
  }

  @Get(':id')
  @Auth([RoleType.TEACHER])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Grade by student id',
    type: GradeDto,
  })
  @ApiVersion(ApiVersionEnum.TEACHER)
  async getCoursesTeacher(
    @UUIDParam('id') studentId: Uuid,
    @AuthUser() userDto: UserDto,
  ): Promise<GradeDto> {
    return this.gradeService.singleGetTeacher(studentId, userDto);
  }

  @Get(':id')
  @Auth([RoleType.STUDENT])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Grade by student id',
    type: GradeDto,
  })
  @ApiVersion(ApiVersionEnum.STUDENT)
  async getCourses(
    @UUIDParam('id') studentId: Uuid,
    @AuthUser() userDto: UserDto,
  ): Promise<GradeDto> {
    return this.gradeService.singleGetTeacher(studentId, userDto);
  }
}
