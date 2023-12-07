import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, Repository } from 'typeorm';

import { type PageDto } from '../../common/dto/page.dto';
import { UserNotFoundException } from '../../exceptions';
import { type UserRegisterDto } from '../auth/dto/user-register.dto';
import { type UserDto } from './dtos/user.dto';
import {
  type AdminUpdateUserDto,
  type UpdateUserDto,
} from './dtos/user-update.dto';
import { type UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserAlreadyCreatedException } from './exceptions/user-already-created.exception';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Find single user
   */
  async findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOneBy(findData);

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity;
  }

  async createUserAdmin(
    userRegisterDto: UserRegisterDto,
    // file?: IFile,
  ): Promise<UserDto> {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: userRegisterDto.email })
      .getOne();

    if (userEntity) {
      throw new UserAlreadyCreatedException();
    }

    const user = this.userRepository.create(userRegisterDto);

    // if (file && !this.validatorService.isImage(file.mimetype)) {  /* FIX this if not need to use */
    //   throw new FileNotImageException();
    // }

    // if (file) {
    //   user.avatar = await this.awsS3Service.uploadImage(file);
    // }

    await this.userRepository.save(user);

    // user.settings = await this.createSettings(
    //   user.id,
    //   plainToClass(CreateSettingsDto, {
    //     isEmailVerified: false,
    //     isPhoneVerified: false,
    //   }),
    // );

    return user.toDto();
  }

  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: userRegisterDto.email })
      .getOne();

    if (userEntity) {
      throw new UserAlreadyCreatedException();
    }

    const user = this.userRepository.create(userRegisterDto);
    console.log(user, 'hass user CREAT IN..............');

    const a = await this.userRepository.save(user);

    console.log(a, 'hass user SAVE IN..............');


    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUserAdmin(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async getUser(userId: Uuid, userDto: UserDto): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    if (userEntity.id !== userDto.id) {
      throw new BadRequestException();
    }

    return userEntity.toDto();
  }

  async updateUser(
    userId: Uuid,
    updateUserDto: UpdateUserDto,
    userDto: UserDto,
  ): Promise<void> {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    if (userEntity.id !== userDto.id) {
      throw new BadRequestException();
    }

    this.userRepository.merge(userEntity, updateUserDto);

    await this.userRepository.save(userEntity);
  }

  async updateAdmin(
    userId: Uuid,
    adminUpdateUserDto: AdminUpdateUserDto,
  ): Promise<void> {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    this.userRepository.merge(userEntity, adminUpdateUserDto);

    await this.userRepository.save(userEntity);
  }

  async deleteAdmin(id: Uuid): Promise<void> {
    const assignmentEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    if (!assignmentEntity) {
      throw new UserNotFoundException();
    }

    await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .delete()
      .execute();
  }
}
