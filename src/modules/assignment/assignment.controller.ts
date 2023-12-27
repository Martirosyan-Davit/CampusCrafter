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
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { ApiVersionEnum, RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { ApiVersion } from '../../decorators/version.decorators';
import { UserDto } from '../user/dtos/user.dto';
import { AssignmentService } from './assignment.service';
import { AssignmentDto } from './dtos/assignment.dto';
import {
  AssignmentAdminCreateDto,
  AssignmentCreateDto,
} from './dtos/assignment-create.dto';
import { AssignmentPageOptionsDto } from './dtos/assignment-page-options.dto';
import { UpdateAssignmentDto } from './dtos/assignment-update.dto';

@Controller('assignments')
@ApiTags('assignments')
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  @Post()
  @ApiOperation({
    summary: 'create assignment by course id',
  })
  @Auth([RoleType.TEACHER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AssignmentDto })
  @ApiVersion(ApiVersionEnum.TEACHER)
  async create(
    @Body() createAssignmentDto: AssignmentCreateDto,
    @AuthUser() userDto: UserDto,
  ): Promise<AssignmentDto> {
    return this.assignmentService.createAssignment(
      createAssignmentDto,
      userDto,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'create assignment by course id',
  })
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AssignmentDto })
  @ApiVersion(ApiVersionEnum.ADMIN)
  async createForAdmin(
    @Body() createAssignmentDto: AssignmentAdminCreateDto,
  ): Promise<AssignmentDto> {
    return this.assignmentService.createAssignmentAdmin(createAssignmentDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'update assignment by id',
  })
  @Auth([RoleType.TEACHER])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiVersion(ApiVersionEnum.TEACHER)
  async updateAssignment(
    @UUIDParam('id') id: Uuid,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @AuthUser() userDto: UserDto,
  ): Promise<void> {
    return this.assignmentService.updateAssignment(
      id,
      updateAssignmentDto,
      userDto,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'update assignment by id',
  })
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiVersion(ApiVersionEnum.ADMIN)
  async updateAssignmentAdmin(
    @UUIDParam('id') id: Uuid,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<void> {
    return this.assignmentService.updateAssignmentAdmin(
      id,
      updateAssignmentDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete assignment by id',
  })
  @Auth([RoleType.TEACHER])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  @ApiVersion(ApiVersionEnum.TEACHER)
  async deleteCourse(
    @UUIDParam('id') id: Uuid,
    @AuthUser() userDto: UserDto,
  ): Promise<void> {
    return this.assignmentService.deleteAssignment(id, userDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete assignment by id',
  })
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  @ApiVersion(ApiVersionEnum.ADMIN)
  async deleteCourseAdmin(@UUIDParam('id') id: Uuid): Promise<void> {
    return this.assignmentService.deleteAssignmentAdmin(id);
  }

  @Get(':courseId')
  @ApiOperation({
    summary: 'get Assignments by course id',
  })
  @Auth([RoleType.STUDENT])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    type: PageDto<AssignmentDto>,
  })
  @ApiVersion(ApiVersionEnum.STUDENT)
  async getAssignments(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: AssignmentPageOptionsDto,
    @UUIDParam('courseId') courseId: Uuid,
    @AuthUser() userDto: UserDto,
  ): Promise<PageDto<AssignmentDto>> {
    return this.assignmentService.getAllForStudent(
      pageOptionsDto,
      userDto,
      courseId,
    );
  }

  @Get(':courseId')
  @ApiOperation({
    summary: 'get Assignments by course id',
  })
  @Auth([RoleType.ADMIN, RoleType.TEACHER], { public: true })
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Assignment list',
    type: PageDto<AssignmentDto>,
  })
  @ApiVersion(ApiVersionEnum.STUDENT, ApiVersionEnum.TEACHER)
  async getAssignment(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: AssignmentPageOptionsDto,
    @UUIDParam('courseId') courseId: Uuid,
  ): Promise<PageDto<AssignmentDto>> {
    return this.assignmentService.getAllAdmin(pageOptionsDto, courseId);
  }
}
