import { RoleType } from '../../../constants';
import {
  EmailField,
  EnumField,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators/';

export class UpdateUserDto {
  @StringFieldOptional({ nullable: true })
  firstName!: string | null;

  @StringFieldOptional({ nullable: true })
  lastName!: string | null;

  @EmailField()
  email!: string;

  @StringFieldOptional({ nullable: true })
  avatarUrl!: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone!: string | null;
}

export class AdminUpdateUserDto {
  @StringFieldOptional({ nullable: true })
  firstName!: string | null;

  @StringFieldOptional({ nullable: true })
  lastName!: string | null;

  @EnumField(() => RoleType)
  role!: RoleType;

  @EmailField()
  email!: string;

  @StringFieldOptional({ nullable: true })
  avatarUrl!: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone!: string | null;

  @StringFieldOptional({ nullable: true })
  bio!: string | null;
}
