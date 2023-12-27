import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { CourseStatusEnum } from '../../../constants';
import {
  DateFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
} from '../../../decorators';

export class CoursePageOptionsDto extends PageOptionsDto {
  @StringFieldOptional()
  readonly teacherId?: string;

  @EnumFieldOptional(() => CourseStatusEnum)
  readonly status?: CourseStatusEnum;

  @DateFieldOptional()
  readonly startDate?: Date;
}
