import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { ApiVersionEnum, RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { ApiVersion } from '../../decorators/version.decorators';
import { UserDto } from '../user/dtos/user.dto';
import { CourseService } from './course.service';
import { CourseDto } from './dtos/course.dto';
import {
  CourseCreateDto,
  CreateCourseAdminDto,
} from './dtos/course-create.dto';
import { CoursePageOptionsDto } from './dtos/course-page-options.dto';
import { UpdateCourseDto } from './dtos/course-update.dto';

@Controller('courses')
@ApiTags('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post()
  @Auth([RoleType.TEACHER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CourseDto })
  @ApiVersion(ApiVersionEnum.TEACHER)
  async create(
    @Body() createPostDto: CourseCreateDto,
    @AuthUser() user: UserDto,
  ): Promise<CourseDto> {
    return this.courseService.createCourse(createPostDto, user.id);
  }

  @Post()
  @ApiOperation({
    description: 'If you are using a teacher account use CourseCreateDto',
  })
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CourseDto })
  @ApiVersion(ApiVersionEnum.ADMIN)
  async createForAdmin(
    @Body() createPostDto: CreateCourseAdminDto,
  ): Promise<CourseDto> {
    return this.courseService.createCourseAdmin(createPostDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get courses list',
  })
  @Auth([RoleType.STUDENT], { public: true })
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get courses list',
    type: PageDto<CourseDto>,
  })
  getCourses(
    @Query() pageOptionsDto: CoursePageOptionsDto,
  ): Promise<PageDto<CourseDto>> {
    return this.courseService.getCourses(pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single courses by course id',
  })
  @Auth([RoleType.STUDENT], { public: true })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get single courses by course id',
    type: CourseDto,
  })
  getCourse(@UUIDParam('id') courseId: Uuid): Promise<CourseDto> {
    return this.courseService.getCourse(courseId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'update course by id',
  })
  @Auth([RoleType.ADMIN, RoleType.TEACHER])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'update course',
  })
  updateCourse(
    @UUIDParam('id') id: Uuid,
    @Body() updateCourseDto: UpdateCourseDto,
    @AuthUser() userDto: UserDto,
  ): Promise<void> {
    return this.courseService.updateCourse(id, updateCourseDto, userDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete course by id',
  })
  @Auth([RoleType.ADMIN, RoleType.TEACHER])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'delete course',
  })
  deleteCourse(
    @UUIDParam('id') courseId: Uuid,
    @AuthUser() userDto: UserDto,
  ): Promise<void> {
    return this.courseService.deleteCourses(courseId, userDto);
  }
}
