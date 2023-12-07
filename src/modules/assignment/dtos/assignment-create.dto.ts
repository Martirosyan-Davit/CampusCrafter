import { SubmissionFormatEnum } from '../../../constants';
import {
  DateField,
  EnumField,
  NumberField,
  StringField,
  UUIDField,
} from '../../../decorators';

export class AssignmentAdminCreateDto {
  @UUIDField()
  courseId!: Uuid;

  @StringField()
  title!: string;

  @StringField()
  content!: string;

  @DateField()
  startDate?: Date;

  @DateField()
  dueDate!: Date;

  @NumberField()
  maxScore!: number;

  @EnumField(() => SubmissionFormatEnum)
  submissionFormat!: SubmissionFormatEnum;
}

export class AssignmentCreateDto {
  @UUIDField()
  courseId!: Uuid;

  @StringField()
  title!: string;

  @StringField()
  content!: string;

  @DateField()
  startDate?: Date;

  @DateField()
  dueDate!: Date;

  @NumberField()
  maxScore!: number;

  @EnumField(() => SubmissionFormatEnum)
  submissionFormat!: SubmissionFormatEnum;
}
