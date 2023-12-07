import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CourseStatusEnum } from '../../../constants';
import {
  EnumFieldOptional,
  StringFieldOptional,
  UUIDField,
} from '../../../decorators';
import { type CourseEntity } from '../course.entity';

export class CourseDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  title?: string | null;

  @StringFieldOptional({ nullable: true })
  description?: string | null;

  @StringFieldOptional({ nullable: true })
  credits!: number;

  @EnumFieldOptional(() => CourseStatusEnum)
  status?: CourseStatusEnum;

  @UUIDField()
  teacherId?: Uuid;

  constructor(course: CourseEntity) {
    super(course);
    this.title = course.title;
    this.description = course.description;
    this.credits = course.credits;
    this.status = course.status;
  }
}
