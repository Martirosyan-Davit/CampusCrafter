import { CourseStatusEnum } from '../../../constants';
import {
  DateField,
  EnumField,
  NumberField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '../../../decorators';

export class CourseCreateDto {
  @StringField()
  title!: string;

  @StringFieldOptional()
  description?: string;

  @DateField()
  startDate!: Date;

  @NumberField()
  credits!: number;

  @NumberField()
  enrollmentLimit!: number;

  @EnumField(() => CourseStatusEnum)
  status!: CourseStatusEnum;
}

export class CreateCourseAdminDto {
  @StringField()
  title!: string;

  @StringFieldOptional()
  description?: string;

  @NumberField()
  credits!: number;

  @DateField()
  startDate!: Date;

  @NumberField()
  enrollmentLimit!: number;

  @EnumField(() => CourseStatusEnum)
  status!: CourseStatusEnum;

  @UUIDField()
  teacherId!: Uuid;
}
