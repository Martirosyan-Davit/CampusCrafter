import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { type RoleType, TokenType } from '../../constants';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../user/user.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { type UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  async userLogin(userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userDto = await this.userService.validate(userLoginDto);

    const tokenPayloadDto = await this.createAccessToken({
      role: userDto.role,
      userId: userDto.id,
    });

    return LoginPayloadDto.create({ accessToken: tokenPayloadDto.accessToken });
  }
}
