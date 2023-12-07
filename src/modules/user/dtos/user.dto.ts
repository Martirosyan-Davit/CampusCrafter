import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants';
import {
  BooleanFieldOptional,
  EmailFieldOptional,
  EnumFieldOptional,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators';
import { type UserEntity } from '../user.entity';

export class UserDto extends AbstractDto {
  //   @StringFieldOptional({ nullable: true })
  //   firstName?: string | null;

  //   @StringFieldOptional({ nullable: true })
  //   lastName?: string | null;

  @StringFieldOptional({ nullable: true })
  username!: string;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(user: UserEntity) {
    super(user);
    // this.firstName = user.firstName;
    // this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.avatar = user.avatarUrl;
  }
}
