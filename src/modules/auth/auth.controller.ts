import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators';
import { UserDto } from '../user/dtos/user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.userLogin(userLoginDto);
  }

  @Post('register')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(userRegisterDto);

    return createdUser.toDto();
  }

  //   @Version('1')
  //   @Get('me')
  //   @HttpCode(HttpStatus.OK)
  //   @Auth([RoleType.USER, RoleType.ADMIN])
  //   @ApiOkResponse({ type: UserDto, description: 'current user info' })  /* FIX if not use */
  //   getCurrentUser(@AuthUser() user: UserEntity): UserDto {
  //     return user.toDto();
  //   }
}
