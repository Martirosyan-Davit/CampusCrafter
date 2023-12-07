import { CourseStatusEnum } from '../../../constants';
import {
  DateFieldOptional,
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '../../../decorators/';

export class UpdateCourseDto {
  @StringFieldOptional()
  title?: string;

  @StringFieldOptional()
  description?: string;

  @EnumFieldOptional(() => CourseStatusEnum)
  status?: CourseStatusEnum;

  @DateFieldOptional()
  startDate?: Date;

  @NumberFieldOptional()
  enrollmentLimit?: number;

  @NumberFieldOptional()
  credits?: number;
}
