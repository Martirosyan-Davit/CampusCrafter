import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiVersionEnum, RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { ApiVersion } from '../../decorators/version.decorators';
import { UserDto } from '../user/dtos/user.dto';
import { GradeDto } from './dtos/grade.dto';
import { GradeCreateDto } from './dtos/grade-create.dto';
import { GradeService } from './grade.service';

@Controller('grades')
@ApiTags('grades')
export class GradeController {
  constructor(private gradeService: GradeService) {}

  @Post()
  @ApiOperation({
    summary: 'Submit Grade',
  })
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Create Grade',
    type: GradeDto,
  })
  @ApiVersion(ApiVersionEnum.ADMIN)
  async createForAdmin(
    @Body() gradeCreateDto: GradeCreateDto,
  ): Promise<GradeDto> {
    return this.gradeService.createGradeAdmin(gradeCreateDto);
  }

  @Post()
  @ApiOperation({
    summary: 'Submit Grade',
  })
  @Auth([RoleType.TEACHER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Create Grade',
    type: GradeDto,
  })
  @ApiVersion(ApiVersionEnum.TEACHER)
  async create(
    @Body() gradeCreateDto: GradeCreateDto,
    @AuthUser() userDto: UserDto,
  ): Promise<GradeDto> {
    return this.gradeService.createGradeTeacher(gradeCreateDto, userDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Grade by student id',
  })
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Grade',
    type: GradeDto,
  })
  @ApiVersion(ApiVersionEnum.ADMIN)
  async getCoursesAdmin(@UUIDParam('id') studentId: Uuid): Promise<GradeDto> {
    return this.gradeService.singleGetAdmin(studentId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Grade by student id',
  })
  @Auth([RoleType.TEACHER])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Grade',
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
  @ApiOperation({
    summary: 'Get Grade by student id',
  })
  @Auth([RoleType.STUDENT])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Grade',
    type: GradeDto,
  })
  @ApiVersion(ApiVersionEnum.STUDENT)
  async getCourses(
    @UUIDParam('id') studentId: Uuid,
    @AuthUser() userDto: UserDto,
  ): Promise<GradeDto> {
    return this.gradeService.singleGetStudent(studentId, userDto);
  }
}
