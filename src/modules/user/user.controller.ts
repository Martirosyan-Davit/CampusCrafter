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
  /* ApiResponse */ ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { ApiVersionEnum, RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { ApiVersion } from '../../decorators/version.decorators';
import { UserRegisterDto } from '../../modules/auth/dto/user-register.dto';
import { UserDto } from './dtos/user.dto';
import { AdminUpdateUserDto, UpdateUserDto } from './dtos/user-update.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserService } from './user.service';
// // import { UserDto } from './dtos/user.dto';
// // import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
// // import { UserEntity } from './user.entity';
// import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  //   @Get('admin')
  //   @Auth([RoleType.USER])
  //   @HttpCode(HttpStatus.OK)
  //   @UseLanguageInterceptor()
  //   async admin(@AuthUser() user: UserEntity) {
  //     const translation = await this.translationService.translate(
  //       'admin.keywords.admin',
  //     );

  //     return {
  //       text: `${translation} ${user.firstName}`,
  //     };
  //   }

  @Post()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: UserDto })
  async createForAdmin(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserDto> {
    return this.userService.createUserAdmin(userRegisterDto);
  }

  @Get()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: PageDto,
  })
  async getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.ADMIN, RoleType.TEACHER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user',
    type: UserDto,
  })
  @ApiVersion(ApiVersionEnum.ADMIN, ApiVersionEnum.TEACHER)
  async getUserAdmin(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.getUserAdmin(userId);
  }

  @Get(':id')
  @Auth([RoleType.STUDENT])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user',
    type: UserDto,
  })
  @ApiVersion(ApiVersionEnum.STUDENT)
  async getUser(
    @UUIDParam('id') userId: Uuid,
    @AuthUser() userDto: UserDto,
  ): Promise<UserDto> {
    return this.userService.getUser(userId, userDto);
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'Delete user',
  })
  async deleteCourseAdmin(@UUIDParam('id') id: Uuid): Promise<void> {
    return this.userService.deleteAdmin(id);
  }

  @Put(':id')
  @Auth([RoleType.STUDENT])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'update User Profile by id',
  })
  @ApiVersion(ApiVersionEnum.STUDENT)
  async updateUser(
    @UUIDParam('id') userId: Uuid,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() userDto: UserDto,
  ): Promise<void> {
    return this.userService.updateUser(userId, updateUserDto, userDto);
  }

  @Put(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'update course by id',
  })
  @ApiVersion(ApiVersionEnum.ADMIN)
  async updateAssignmentAdmin(
    @UUIDParam('id') userId: Uuid,
    @Body() adminUpdateUserDto: AdminUpdateUserDto,
  ): Promise<void> {
    return this.userService.updateAdmin(userId, adminUpdateUserDto);
  }
}
