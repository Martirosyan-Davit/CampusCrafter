import { BaseDto } from '../../../common/dto/base.dto';
import { StringField } from '../../../decorators';

export class LoginPayloadDto extends BaseDto {
  @StringField()
  accessToken!: string;
}
